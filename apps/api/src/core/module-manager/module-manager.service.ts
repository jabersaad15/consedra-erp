import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class Module-managerService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ moduleKey: { contains: params.search, mode: 'insensitive' } }];
    }
    const [data, total] = await Promise.all([
      this.prisma.tenantModule.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.tenantModule.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.tenantModule.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.tenantModule.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.tenantModule.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.tenantModule.delete({ where: { id } });
  }
}