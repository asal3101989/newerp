import { Controller, Get, Param } from "@nestjs/common";
import { TenantsService } from "./tenants.service";

@Controller("tenants")
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @Get()
  findAll() {
    return this.tenants.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tenants.findOne(id);
  }
}
