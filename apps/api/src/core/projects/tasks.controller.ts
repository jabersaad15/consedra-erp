import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@ApiTags('Tasks')
@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@CurrentTenant() tenantId: string, @Query() q: any) {
    const { page, limit, skip, orderBy } = buildPagination(q);
    const where: any = { tenantId };
    if (q.status) where.status = q.status;
    if (q.assigneeId) where.assigneeId = q.assigneeId;
    const [data, total] = await Promise.all([
      this.prisma.task.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.task.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  @Post()
  create(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.prisma.task.create({ data: { ...body, tenantId } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.prisma.task.update({ where: { id }, data: body });
  }
}