import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ action: { contains: params.search, mode: 'insensitive' } }, { entityType: { contains: params.search, mode: 'insensitive' } }, { actorEmail: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.entityType) where.entityType = params.entityType;
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.auditLog.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.auditLog.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.auditLog.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.auditLog.delete({ where: { id } });
  }
}