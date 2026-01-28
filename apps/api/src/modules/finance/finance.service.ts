import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ description: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.status) where.status = params.status;
    if (params.branchId) where.branchId = params.branchId;
    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.expense.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.expense.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.expense.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.expense.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.expense.delete({ where: { id } });
  }
}