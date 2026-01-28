import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ number: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.status) where.status = params.status;
    const [data, total] = await Promise.all([
      this.prisma.productionOrder.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.productionOrder.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.productionOrder.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.productionOrder.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.productionOrder.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.productionOrder.delete({ where: { id } });
  }
}