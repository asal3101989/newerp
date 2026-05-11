import { Controller, Get, Param } from "@nestjs/common";
import { AuditService } from "./audit.service";

@Controller("tenants/:tenantId/audit")
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  findByTenant(@Param("tenantId") tenantId: string) {
    return this.audit.findByTenant(tenantId);
  }
}
