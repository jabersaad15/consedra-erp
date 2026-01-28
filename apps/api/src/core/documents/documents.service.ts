import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ name: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.entityType) where.entityType = params.entityType;
    const [data, total] = await Promise.all([
      this.prisma.document.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.document.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.document.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.document.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.document.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.document.delete({ where: { id } });
  }
}