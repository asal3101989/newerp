"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const ai_module_1 = require("./modules/ai/ai.module");
const approvals_module_1 = require("./modules/approvals/approvals.module");
const compliance_module_1 = require("./modules/compliance/compliance.module");
const auth_guard_1 = require("./modules/auth/auth.guard");
const audit_module_1 = require("./modules/audit/audit.module");
const auth_module_1 = require("./modules/auth/auth.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const documents_module_1 = require("./modules/documents/documents.module");
const finance_module_1 = require("./modules/finance/finance.module");
const health_module_1 = require("./modules/health/health.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const module_actions_module_1 = require("./modules/module-actions/module-actions.module");
const procurement_module_1 = require("./modules/procurement/procurement.module");
const projects_module_1 = require("./modules/projects/projects.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const users_module_1 = require("./modules/users/users.module");
const workflows_module_1 = require("./modules/workflows/workflows.module");
const shared_module_1 = require("./shared/shared.module");
const records_module_1 = require("./modules/records/records.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            shared_module_1.SharedModule,
            auth_module_1.AuthModule,
            audit_module_1.AuditModule,
            tenants_module_1.TenantsModule,
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            dashboard_module_1.DashboardModule,
            health_module_1.HealthModule,
            approvals_module_1.ApprovalsModule,
            procurement_module_1.ProcurementModule,
            inventory_module_1.InventoryModule,
            module_actions_module_1.ModuleActionsModule,
            finance_module_1.FinanceModule,
            documents_module_1.DocumentsModule,
            workflows_module_1.WorkflowsModule,
            ai_module_1.AiModule,
            compliance_module_1.ComplianceModule,
            records_module_1.RecordsModule
        ],
        providers: [
            core_1.Reflector,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard
            }
        ]
    })
], AppModule);
