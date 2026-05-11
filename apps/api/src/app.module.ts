import { Module } from "@nestjs/common";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { AiModule } from "./modules/ai/ai.module";
import { ApprovalsModule } from "./modules/approvals/approvals.module";
import { ComplianceModule } from "./modules/compliance/compliance.module";
import { AuthGuard } from "./modules/auth/auth.guard";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { HealthModule } from "./modules/health/health.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { ModuleActionsModule } from "./modules/module-actions/module-actions.module";
import { ProcurementModule } from "./modules/procurement/procurement.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { TenantsModule } from "./modules/tenants/tenants.module";
import { UsersModule } from "./modules/users/users.module";
import { WorkflowsModule } from "./modules/workflows/workflows.module";
import { SharedModule } from "./shared/shared.module";
import { RecordsModule } from "./modules/records/records.module";

@Module({
  imports: [
    PrismaModule,
    SharedModule,
    AuthModule,
    AuditModule,
    TenantsModule,
    UsersModule,
    ProjectsModule,
    DashboardModule,
    HealthModule,
    ApprovalsModule,
    ProcurementModule,
    InventoryModule,
    ModuleActionsModule,
    FinanceModule,
    DocumentsModule,
    WorkflowsModule,
    AiModule,
    ComplianceModule,
    RecordsModule
  ],
  providers: [
    Reflector,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
