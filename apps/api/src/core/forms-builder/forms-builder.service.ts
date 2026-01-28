import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class FormsBuilderService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ name: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.moduleKey) where.moduleKey = params.moduleKey;
    const [data, total] = await Promise.all([
      this.prisma.formDefinition.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.formDefinition.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.formDefinition.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.formDefinition.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.formDefinition.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.formDefinition.delete({ where: { id } });
  }
}