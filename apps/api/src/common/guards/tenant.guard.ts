import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic) return true;
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (user?.isSuperAdmin) {
      const slug = req.headers['x-tenant-slug'];
      if (slug) {
        const t = await this.prisma.tenant.findUnique({ where: { slug } });
        if (t) req.tenantId = t.id;
      }
      return true;
    }
    const host = req.headers.host || '';
    const slug = req.headers['x-tenant-slug'] || host.split('.')[0];
    if (!slug || slug === 'localhost' || slug === '127') throw new ForbiddenException('Tenant not resolved');
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant || !tenant.isActive) throw new ForbiddenException('Tenant not found or inactive');
    if (user?.tenantId && user.tenantId !== tenant.id) throw new ForbiddenException('Tenant mismatch');
    req.tenantId = tenant.id;
    return true;
  }
}