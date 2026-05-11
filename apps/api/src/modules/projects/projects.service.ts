import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prisma.project.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" }
    });
  }

  async findOne(tenantId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, tenantId } });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);
    return project;
  }

  async getHealth(tenantId: string) {
    const projects = await this.findByTenant(tenantId);
    return projects.map((project) => ({
      projectId: project.id,
      name: project.name,
      progress: project.progress,
      status: project.status,
      healthScore: Math.max(0, Math.round(project.progress - (project.status === "At Risk" ? 18 : 0))),
      aiRecommendation:
        project.status === "At Risk"
          ? "Escalate schedule, procurement, and site manpower review"
          : "Continue baseline monitoring"
    }));
  }

  async create(tenantId: string, data: any) {
    return this.prisma.project.create({
      data: {
        ...data,
        tenantId
      }
    });
  }

  async update(tenantId: string, projectId: string, data: any) {
    return this.prisma.project.update({
      where: { id: projectId, tenantId },
      data
    });
  }

  async remove(tenantId: string, projectId: string) {
    return this.prisma.project.delete({
      where: { id: projectId, tenantId }
    });
  }
}
