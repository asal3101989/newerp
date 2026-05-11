import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getErpHome(tenantId: string) {
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
}
