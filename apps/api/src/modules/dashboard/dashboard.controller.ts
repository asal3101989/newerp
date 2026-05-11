import { Controller, Get, Param } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("tenants/:tenantId/dashboard")
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get("erp-home")
  getErpHome(@Param("tenantId") tenantId: string) {
    return this.dashboard.getErpHome(tenantId);
  }
}
