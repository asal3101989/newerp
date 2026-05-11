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
exports.ProcurementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProcurementService = class ProcurementService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllPos(tenantId) {
        return this.prisma.purchaseOrder.findMany({
            where: { tenantId },
            include: { vendor: true, material: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createPo(tenantId, data) {
        const count = await this.prisma.purchaseOrder.count({ where: { tenantId } });
        const poNumber = `PO-${(count + 1).toString().padStart(4, '0')}`;
        return this.prisma.purchaseOrder.create({
            data: {
                ...data,
                poNumber,
                tenantId
            }
        });
    }
    async updatePoStatus(tenantId, id, status) {
        return this.prisma.purchaseOrder.update({
            where: { id, tenantId },
            data: { status }
        });
    }
};
exports.ProcurementService = ProcurementService;
exports.ProcurementService = ProcurementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProcurementService);
