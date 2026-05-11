import { Controller, Get, Param, Post, Put, Delete, Body } from "@nestjs/common";
import { ProjectsService } from "./projects.service";

@Controller("tenants/:tenantId/projects")
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findByTenant(@Param("tenantId") tenantId: string) {
    return this.projects.findByTenant(tenantId);
  }

  @Get("health")
  getHealth(@Param("tenantId") tenantId: string) {
    return this.projects.getHealth(tenantId);
  }

  @Get(":projectId")
  findOne(@Param("tenantId") tenantId: string, @Param("projectId") projectId: string) {
    return this.projects.findOne(tenantId, projectId);
  }

  @Post()
  create(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.projects.create(tenantId, data);
  }

  @Put(":projectId")
  update(@Param("tenantId") tenantId: string, @Param("projectId") projectId: string, @Body() data: any) {
    return this.projects.update(tenantId, projectId, data);
  }

  @Delete(":projectId")
  remove(@Param("tenantId") tenantId: string, @Param("projectId") projectId: string) {
    return this.projects.remove(tenantId, projectId);
  }
}
