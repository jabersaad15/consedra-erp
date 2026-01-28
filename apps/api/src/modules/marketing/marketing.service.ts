import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ name: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.status) where.status = params.status;
    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.campaign.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.campaign.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.campaign.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.campaign.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.campaign.delete({ where: { id } });
  }
}