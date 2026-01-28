import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } }); }
  findBySlug(slug: string) { return this.prisma.tenant.findUnique({ where: { slug } }); }

  async create(data: { name: string; slug: string; ownerEmail: string; ownerFirstName: string; ownerLastName: string; ownerPassword: string }) {
    const existing = await this.prisma.tenant.findUnique({ where: { slug: data.slug } });
    if (existing) throw new BadRequestException('Slug exists');
    const hash = await bcrypt.hash(data.ownerPassword, 12);
    return this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({ data: { name: data.name, slug: data.slug } });
      const owner = await tx.user.create({ data: { email: data.ownerEmail, passwordHash: hash, firstName: data.ownerFirstName, lastName: data.ownerLastName, tenantId: tenant.id } });
      await tx.tenant.update({ where: { id: tenant.id }, data: { ownerId: owner.id } });
      return { tenant, owner };
    });
  }

  async initiateTransfer(tenantId: string, newOwnerEmail: string, reason: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException();
    return this.prisma.ownershipTransfer.create({ data: { tenantId, fromUserId: tenant.ownerId!, toUserEmail: newOwnerEmail, token: uuid(), reason, expiresAt: new Date(Date.now() + 15 * 60 * 1000) } });
  }

  async confirmTransfer(token: string) {
    const t = await this.prisma.ownershipTransfer.findUnique({ where: { token } });
    if (!t || t.status !== 'PENDING') throw new BadRequestException('Invalid');
    if (t.expiresAt < new Date()) { await this.prisma.ownershipTransfer.update({ where: { id: t.id }, data: { status: 'EXPIRED' } }); throw new BadRequestException('Expired'); }
    const newOwner = await this.prisma.user.findFirst({ where: { email: t.toUserEmail } });
    if (!newOwner) throw new NotFoundException('User not found');
    await this.prisma.$transaction([
      this.prisma.tenant.update({ where: { id: t.tenantId }, data: { ownerId: newOwner.id } }),
      this.prisma.ownershipTransfer.update({ where: { id: t.id }, data: { status: 'CONFIRMED', confirmedAt: new Date() } }),
    ]);
    return { message: 'Transferred' };
  }
}