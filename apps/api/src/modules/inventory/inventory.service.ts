import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { tenantId },
      orderBy: { material: "asc" }
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.inventoryItem.findFirst({ where: { id, tenantId }, include: { warehouse: true } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.inventoryItem.create({
      data: { ...data, tenantId }
    });
  }

  async update(tenantId: string, id: string, data: any) {
    return this.prisma.inventoryItem.update({
      where: { id, tenantId },
      data
    });
  }

  // Warehouses
  async findAllWarehouses(tenantId: string) {
    return this.prisma.warehouse.findMany({ where: { tenantId } });
  }

  async createWarehouse(tenantId: string, data: any) {
    return this.prisma.warehouse.create({
      data: { ...data, tenantId }
    });
  }

  // Transactions
  async recordTransaction(tenantId: string, itemId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.stockTransaction.create({
        data: { ...data, itemId, tenantId }
      });

      const adjustment = data.type === 'IN' ? data.quantity : -data.quantity;
      
      await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          onHand: { increment: adjustment }
        }
      });

      return transaction;
    });
  }

  async getTransactions(tenantId: string) {
    return this.prisma.stockTransaction.findMany({
      where: { tenantId },
      include: { item: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
