import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { InventoryService } from "../inventory/inventory.service";

@Injectable()
export class GrnService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService
  ) {}

  async findAll(tenantId: string) {
    return this.prisma.gRN.findMany({ 
      where: { tenantId },
      include: { po: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(tenantId: string, data: any) {
    const count = await this.prisma.gRN.count({ where: { tenantId } });
    const grnNo = `GRN-${(count + 1).toString().padStart(4, '0')}`;
    
    return this.prisma.$transaction(async (tx) => {
      const grn = await tx.gRN.create({
        data: { 
          ...data, 
          grnNo, 
          tenantId,
          items: typeof data.items === 'string' ? data.items : JSON.stringify(data.items)
        }
      });

      // Update PO status
      await tx.purchaseOrder.update({
        where: { id: data.poId },
        data: { status: 'Closed' }
      });

      // Parse items and update inventory
      const items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
      if (Array.isArray(items)) {
        for (const item of items) {
          const materialName = item.material || item.item;
          const qty = item.receivedQty || item.quantity || 0;

          // Find or create InventoryItem
          let invItem = await tx.inventoryItem.findFirst({
            where: { 
              tenantId, 
              material: materialName,
              warehouseId: data.warehouseId || undefined
            }
          });

          if (!invItem) {
            invItem = await tx.inventoryItem.create({
              data: {
                tenantId,
                material: materialName,
                sku: item.sku || `SKU-${materialName.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                unit: item.unit || 'Nos',
                warehouseId: data.warehouseId || null,
                onHand: 0
              }
            });
          }

          // Atomic Stock Update via Inventory Pattern
          await tx.stockTransaction.create({
            data: {
              tenantId,
              itemId: invItem.id,
              type: 'IN',
              quantity: qty,
              referenceId: grn.id
            }
          });

          await tx.inventoryItem.update({
            where: { id: invItem.id },
            data: {
              onHand: { increment: qty }
            }
          });
        }
      }

      return grn;
    });
  }
}
