import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ name: { contains: params.search, mode: 'insensitive' } }, { key: { contains: params.search, mode: 'insensitive' } }];
    }
    const [data, total] = await Promise.all([
      this.prisma.roleDefinition.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.roleDefinition.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.roleDefinition.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.roleDefinition.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.roleDefinition.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.roleDefinition.delete({ where: { id } });
  }
}