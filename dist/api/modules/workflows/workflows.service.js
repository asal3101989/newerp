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
exports.WorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let WorkflowsService = class WorkflowsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByTenant(tenantId) {
        return this.prisma.workflow.findMany({ where: { tenantId } });
    }
    async getEvents(tenantId) {
        return this.prisma.auditLog.findMany({
            where: { tenantId },
            orderBy: { createdAt: "desc" },
            take: 20
        });
    }
    async simulate(tenantId, workflowId) {
        const workflow = await this.prisma.workflow.findUnique({ where: { id: workflowId } });
        if (!workflow)
            throw new common_1.NotFoundException(`Workflow ${workflowId} not found`);
        const actions = (Array.isArray(workflow.actions) ? workflow.actions : []);
        return {
            workflow,
            simulation: actions.map((action, index) => ({
                sequence: index + 1,
                action,
                status: workflow.enabled ? "will-run" : "disabled"
            }))
        };
    }
};
exports.WorkflowsService = WorkflowsService;
exports.WorkflowsService = WorkflowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkflowsService);
