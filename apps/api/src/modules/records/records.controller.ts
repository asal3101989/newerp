import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from "@nestjs/common";
import { RecordsService } from "./records.service";

@Controller("tenants/:tenantId/records")
export class RecordsController {
  constructor(@Inject(RecordsService) private readonly records: RecordsService) {}

  @Get(":module")
  findAll(@Param("tenantId") tenantId: string, @Param("module") module: string) {
    return this.records.findAll(tenantId, module);
  }

  @Post(":module")
  create(
    @Param("tenantId") tenantId: string,
    @Param("module") module: string,
    @Body() body: { recordId: string; primary: string; secondary?: string; value?: string; owner?: string; status?: string }
  ) {
    return this.records.create(tenantId, module, body);
  }

  @Patch(":module/:id")
  update(
    @Param("tenantId") tenantId: string,
    @Param("module") module: string,
    @Param("id") id: string,
    @Body() body: Partial<{ recordId: string; primary: string; secondary: string; value: string; owner: string; status: string }>
  ) {
    return this.records.update(tenantId, module, id, body);
  }

  @Delete(":module/:id")
  remove(
    @Param("tenantId") tenantId: string,
    @Param("module") module: string,
    @Param("id") id: string
  ) {
    return this.records.remove(tenantId, module, id);
  }
}
