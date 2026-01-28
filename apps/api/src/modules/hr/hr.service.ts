import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [{ firstName: { contains: params.search, mode: 'insensitive' } }, { lastName: { contains: params.search, mode: 'insensitive' } }, { email: { contains: params.search, mode: 'insensitive' } }];
    }
    if (params.departmentId) where.departmentId = params.departmentId;
    if (params.branchId) where.branchId = params.branchId;
    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.employee.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.employee.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.employee.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.employee.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.employee.delete({ where: { id } });
  }
}