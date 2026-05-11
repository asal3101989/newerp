import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import type { ApprovalStatus } from "../../shared/domain.types";
import { ApprovalsService } from "./approvals.service";

@Controller("tenants/:tenantId/approvals")
export class ApprovalsController {
  constructor(private readonly approvals: ApprovalsService) {}

  @Get()
  findByTenant(@Param("tenantId") tenantId: string) {
    return this.approvals.findByTenant(tenantId);
  }

  @Patch(":approvalId/decision")
  decide(
    @Param("tenantId") tenantId: string,
    @Param("approvalId") approvalId: string,
    @Body("status") status: ApprovalStatus
  ) {
    return this.approvals.decide(tenantId, approvalId, status);
  }
}
