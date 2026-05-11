import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Public } from "../auth/public.decorator";
import { ComplianceService } from "./compliance.service";

@Controller("tenants/:tenantId/compliance")
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Public()
  @Post("gst/validate")
  validateGstin(@Param("tenantId") tenantId: string, @Body() body: { gstin: string }) {
    return this.complianceService.validateGstin(body.gstin ?? "");
  }

  @Public()
  @Post("einvoice/generate")
  generateEInvoice(
    @Param("tenantId") tenantId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.complianceService.generateEInvoice(tenantId, body);
  }

  @Public()
  @Post("eway-bill/generate")
  generateEWayBill(
    @Param("tenantId") tenantId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.complianceService.generateEWayBill(tenantId, body);
  }

  @Public()
  @Get("gstr/status")
  getGstrStatus(@Param("tenantId") tenantId: string) {
    return this.complianceService.getGstrStatus(tenantId);
  }
}
