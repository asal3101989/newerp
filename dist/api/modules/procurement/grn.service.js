"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrnService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const inventory_service_1 = require("../inventory/inventory.service");
let GrnService = class GrnService {
    constructor(prisma, inventory) {
        this.prisma = prisma;
        this.inventory = inventory;
    }
    async findAll(tenantId) {
        return this.prisma.gRN.findMany({
            where: { tenantId },
            include: { po: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(tenantId, data) {
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
                                sku: item.sku || `SKU-${materialName.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
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
};
exports.GrnService = GrnService;
exports.GrnService = GrnService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inventory_service_1.InventoryService])
], GrnService);
