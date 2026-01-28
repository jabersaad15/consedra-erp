import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { TasksController } from './core/projects/tasks.controller';
import { AuthModule } from './core/auth/auth.module';
import { TenantModule } from './core/tenant/tenant.module';
import { UsersModule } from './core/users/users.module';
import { RolesModule } from './core/roles/roles.module';
import { AuditModule } from './core/audit/audit.module';
import { OrgStructureModule } from './core/org-structure/org-structure.module';
import { ModuleManagerModule } from './core/module-manager/module-manager.module';
import { WorkflowModule } from './core/workflow/workflow.module';
import { FormsBuilderModule } from './core/forms-builder/forms-builder.module';
import { ReportsModule } from './core/reports/reports.module';
import { ProjectsModule } from './core/projects/projects.module';
import { NotificationsModule } from './core/notifications/notifications.module';
import { DocumentsModule } from './core/documents/documents.module';
import { IntegrationHubModule } from './core/integration-hub/integration-hub.module';
import { OperationsModule } from './modules/operations/operations.module';
import { HrModule } from './modules/hr/hr.module';
import { FinanceModule } from './modules/finance/finance.module';
import { PurchasingModule } from './modules/purchasing/purchasing.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SalesModule } from './modules/sales/sales.module';
import { CrmModule } from './modules/crm/crm.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { ItHelpdeskModule } from './modules/it-helpdesk/it-helpdesk.module';
import { QualityModule } from './modules/quality/quality.module';
import { ProductionModule } from './modules/production/production.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    TenantModule,
    UsersModule,
    RolesModule,
    AuditModule,
    OrgStructureModule,
    ModuleManagerModule,
    WorkflowModule,
    FormsBuilderModule,
    ReportsModule,
    ProjectsModule,
    NotificationsModule,
    DocumentsModule,
    IntegrationHubModule,
    OperationsModule,
    HrModule,
    FinanceModule,
    PurchasingModule,
    InventoryModule,
    SalesModule,
    CrmModule,
    MarketingModule,
    ItHelpdeskModule,
    QualityModule,
    ProductionModule,
  ],
  controllers: [TasksController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}