import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';

@ApiTags('Reports')
@Controller('api/reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @Get() @RequirePermissions('view') @ApiOperation({ summary: 'List reports' })
  findAll(@CurrentTenant() tenantId: string, @Query() query: any) { return this.svc.findAll(tenantId, query); }

  @Get(':id') @RequirePermissions('view')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post() @RequirePermissions('create') @ApiOperation({ summary: 'Create' })
  create(@CurrentTenant() tenantId: string, @Body() body: any) { return this.svc.create(tenantId, body); }

  @Put(':id') @RequirePermissions('update')
  update(@Param('id') id: string, @Body() body: any) { return this.svc.update(id, body); }

  @Delete(':id') @RequirePermissions('delete')
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}