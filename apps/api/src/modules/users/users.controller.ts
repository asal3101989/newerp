import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("tenants/:tenantId/users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  findByTenant(@Param("tenantId") tenantId: string) {
    return this.users.findByTenant(tenantId);
  }

  @Get("permissions")
  getRolePermissions(@Param("tenantId") tenantId: string) {
    return this.users.getRolePermissions(tenantId);
  }
}
