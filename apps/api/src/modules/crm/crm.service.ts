import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ number: { contains: params.search, mode: 'insensitive' } }, { customerName: { contains: params.search, mode: 'insensitive' } }, { subject: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;
    if (params.category) where.category = params.category;
    const [data, total] = await Promise.all([
      this.prisma.crmTicket.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.crmTicket.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.crmTicket.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.crmTicket.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.crmTicket.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.crmTicket.delete({ where: { id } });
  }
}