import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [];
    }
    if (params.branchId) where.branchId = params.branchId;
    const [data, total] = await Promise.all([
      this.prisma.salesSummary.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.salesSummary.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.salesSummary.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.salesSummary.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.salesSummary.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.salesSummary.delete({ where: { id } });
  }
}