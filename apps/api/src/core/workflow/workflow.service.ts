import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ entityType: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.entityType) where.entityType = params.entityType;
    if (params.status) where.status = params.status;
    const [data, total] = await Promise.all([
      this.prisma.approvalRequest.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.approvalRequest.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.approvalRequest.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.approvalRequest.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.approvalRequest.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.approvalRequest.delete({ where: { id } });
  }
}