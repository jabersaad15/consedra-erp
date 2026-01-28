import { Controller, Get, Post, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/permissions.decorator';

@ApiTags('Tenants')
@Controller('api/tenants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TenantController {
  constructor(private svc: TenantService) {}

  @Get()
  findAll(@CurrentUser() user: any) { if (!user.isSuperAdmin) throw new ForbiddenException(); return this.svc.findAll(); }

  @Post()
  create(@Body() dto: any, @CurrentUser() user: any) { if (!user.isSuperAdmin) throw new ForbiddenException(); return this.svc.create(dto); }

  @Post(':id/transfer')
  transfer(@Param('id') id: string, @Body() dto: any) { return this.svc.initiateTransfer(id, dto.newOwnerEmail, dto.reason); }

  @Public() @Post('transfer/confirm')
  confirm(@Body() dto: any) { return this.svc.confirmTransfer(dto.token); }
}