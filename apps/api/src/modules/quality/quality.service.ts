import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class QualityService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ title: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.branchId) where.branchId = params.branchId;
    if (params.type) where.type = params.type;
    const [data, total] = await Promise.all([
      this.prisma.qualityChecklist.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.qualityChecklist.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.qualityChecklist.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.qualityChecklist.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.qualityChecklist.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.qualityChecklist.delete({ where: { id } });
  }
}