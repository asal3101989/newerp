"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getErpHome(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        const projects = await this.prisma.project.findMany({ where: { tenantId } });
        const lowStock = await this.prisma.inventoryItem.findMany({
            where: { tenantId, status: { in: ["low", "blocked"] } }
        });
        const finance = await this.prisma.financeSummary.findFirst({ where: { tenantId } });
        const approvals = await this.prisma.approval.findMany({
            where: { tenantId, status: "pending" },
            include: { purchaseOrder: true, project: true, currentApprover: true }
        });
        return {
            tenant,
            kpis: {
                activeProjects: projects.length,
                highRiskProjects: projects.filter((p) => p.status === "At Risk").length,
                pendingApprovals: approvals.length,
                lowStockItems: lowStock.length,
                cashflowDays: finance?.cashflowDays ?? 0
            },
            approvals,
            projects,
            lowStock,
            aiBrief: [
                "Tower B needs shuttering crew capacity review this week.",
                "Two low-stock materials can trigger draft POs through workflow wf-stock-po.",
                "Invoice OCR queue is clear for processed documents."
            ]
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
