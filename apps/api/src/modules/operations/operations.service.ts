import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ title: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.branchId) where.branchId = params.branchId;
    if (params.frequency) where.frequency = params.frequency;
    const [data, total] = await Promise.all([
      this.prisma.checklist.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.checklist.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.checklist.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.checklist.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.checklist.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.checklist.delete({ where: { id } });
  }
}