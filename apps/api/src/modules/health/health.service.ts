import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus() {
    const [projects, approvals, documents, inventory, workflows, auditEvents] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.approval.count(),
      this.prisma.document.count(),
      this.prisma.inventoryItem.count(),
      this.prisma.workflow.count(),
      this.prisma.auditLog.count()
    ]);

    return {
      ok: true,
      service: "bcim-erp-api",
      mode: "sqlite",
      database: "sqlite",
      timestamp: new Date().toISOString(),
      counts: {
        projects,
        approvals,
        documents,
        inventory,
        workflows,
        auditEvents
      }
    };
  }
}
