import { Body, Controller, Param, Post } from "@nestjs/common";
import { ModuleActionsService } from "./module-actions.service";

@Controller("tenants/:tenantId/module-actions")
export class ModuleActionsController {
  constructor(private readonly actions: ModuleActionsService) {}

  @Post()
  record(
    @Param("tenantId") tenantId: string,
    @Body() body: { module: string; submenu: string; action: string; message: string }
  ) {
    return this.actions.record(tenantId, body);
  }
}
