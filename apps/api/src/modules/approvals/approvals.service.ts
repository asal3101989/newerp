import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prisma.approval.findMany({
      where: { tenantId },
      include: {
        currentApprover: true,
        project: true,
        purchaseOrder: true
      },
      orderBy: { updatedAt: "desc" }
    });
  }

  async decide(tenantId: string, approvalId: string, status: string) {
    const approval = await this.prisma.approval.findUnique({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException(`Approval ${approvalId} not found`);

    return this.prisma.approval.update({
      where: { id: approvalId },
      data: { status: status as any },
      include: { currentApprover: true, project: true, purchaseOrder: true }
    });
  }
}
