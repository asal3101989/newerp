import { Controller, Get, Param, Post } from "@nestjs/common";
import { WorkflowsService } from "./workflows.service";

@Controller("tenants/:tenantId/workflows")
export class WorkflowsController {
  constructor(private readonly workflows: WorkflowsService) {}

  @Get()
  findByTenant(@Param("tenantId") tenantId: string) {
    return this.workflows.findByTenant(tenantId);
  }

  @Get("events")
  getEvents(@Param("tenantId") tenantId: string) {
    return this.workflows.getEvents(tenantId);
  }

  @Post(":workflowId/simulate")
  simulate(@Param("tenantId") tenantId: string, @Param("workflowId") workflowId: string) {
    return this.workflows.simulate(tenantId, workflowId);
  }
}
