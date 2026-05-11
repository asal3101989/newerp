import { Controller, Get, Param, Post, Body, Put, Delete } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

@Controller("tenants/:tenantId/inventory")
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get()
  findByTenant(@Param("tenantId") tenantId: string) {
    return this.inventory.findByTenant(tenantId);
  }

  @Get("items/:id")
  findOne(@Param("tenantId") tenantId: string, @Param("id") id: string) {
    return this.inventory.findOne(tenantId, id);
  }

  @Post("items")
  create(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.inventory.create(tenantId, data);
  }

  @Put("items/:id")
  update(@Param("tenantId") tenantId: string, @Param("id") id: string, @Body() data: any) {
    return this.inventory.update(tenantId, id, data);
  }

  // Warehouses
  @Get("warehouses")
  findAllWarehouses(@Param("tenantId") tenantId: string) {
    return this.inventory.findAllWarehouses(tenantId);
  }

  @Post("warehouses")
  createWarehouse(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.inventory.createWarehouse(tenantId, data);
  }

  // Transactions
  @Get("transactions")
  getTransactions(@Param("tenantId") tenantId: string) {
    return this.inventory.getTransactions(tenantId);
  }

  @Post("items/:id/transactions")
  recordTransaction(@Param("tenantId") tenantId: string, @Param("id") id: string, @Body() data: any) {
    return this.inventory.recordTransaction(tenantId, id, data);
  }
}
