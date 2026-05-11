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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByTenant(tenantId) {
        return this.prisma.project.findMany({
            where: { tenantId },
            orderBy: { updatedAt: "desc" }
        });
    }
    async findOne(tenantId, projectId) {
        const project = await this.prisma.project.findFirst({ where: { id: projectId, tenantId } });
        if (!project)
            throw new common_1.NotFoundException(`Project ${projectId} not found`);
        return project;
    }
    async getHealth(tenantId) {
        const projects = await this.findByTenant(tenantId);
        return projects.map((project) => ({
            projectId: project.id,
            name: project.name,
            progress: project.progress,
            status: project.status,
            healthScore: Math.max(0, Math.round(project.progress - (project.status === "At Risk" ? 18 : 0))),
            aiRecommendation: project.status === "At Risk"
                ? "Escalate schedule, procurement, and site manpower review"
                : "Continue baseline monitoring"
        }));
    }
    async create(tenantId, data) {
        return this.prisma.project.create({
            data: {
                ...data,
                tenantId
            }
        });
    }
    async update(tenantId, projectId, data) {
        return this.prisma.project.update({
            where: { id: projectId, tenantId },
            data
        });
    }
    async remove(tenantId, projectId) {
        return this.prisma.project.delete({
            where: { id: projectId, tenantId }
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
