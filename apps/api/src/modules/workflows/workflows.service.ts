import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class WorkflowsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prisma.workflow.findMany({ where: { tenantId } });
  }

  async getEvents(tenantId: string) {
    return this.prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 20
    });
  }

  async simulate(tenantId: string, workflowId: string) {
    const workflow = await this.prisma.workflow.findUnique({ where: { id: workflowId } });
    if (!workflow) throw new NotFoundException(`Workflow ${workflowId} not found`);
    const actions: string[] = (Array.isArray(workflow.actions) ? workflow.actions : []) as string[];

    return {
      workflow,
      simulation: actions.map((action, index) => ({
        sequence: index + 1,
        action,
        status: workflow.enabled ? "will-run" : "disabled"
      }))
    };
  }
}
