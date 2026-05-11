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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByTenant(tenantId) {
        return this.prisma.inventoryItem.findMany({
            where: { tenantId },
            orderBy: { material: "asc" }
        });
    }
    async findOne(tenantId, id) {
        return this.prisma.inventoryItem.findFirst({ where: { id, tenantId }, include: { warehouse: true } });
    }
    async create(tenantId, data) {
        return this.prisma.inventoryItem.create({
            data: { ...data, tenantId }
        });
    }
    async update(tenantId, id, data) {
        return this.prisma.inventoryItem.update({
            where: { id, tenantId },
            data
        });
    }
    // Warehouses
    async findAllWarehouses(tenantId) {
        return this.prisma.warehouse.findMany({ where: { tenantId } });
    }
    async createWarehouse(tenantId, data) {
        return this.prisma.warehouse.create({
            data: { ...data, tenantId }
        });
    }
    // Transactions
    async recordTransaction(tenantId, itemId, data) {
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
    async getTransactions(tenantId) {
        return this.prisma.stockTransaction.findMany({
            where: { tenantId },
            include: { item: true },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
