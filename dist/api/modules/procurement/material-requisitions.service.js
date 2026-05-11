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
exports.MaterialRequisitionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MaterialRequisitionsService = class MaterialRequisitionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.materialRequisition.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(tenantId, data) {
        const count = await this.prisma.materialRequisition.count({ where: { tenantId } });
        const mrNo = `MR-${(count + 1).toString().padStart(4, '0')}`;
        return this.prisma.materialRequisition.create({
            data: {
                ...data,
                mrNo,
                tenantId,
                items: typeof data.items === 'string' ? data.items : JSON.stringify(data.items)
            }
        });
    }
    async updateStatus(tenantId, id, status) {
        return this.prisma.materialRequisition.update({
            where: { id, tenantId },
            data: { status }
        });
    }
    async convertToRfq(tenantId, id) {
        return this.prisma.$transaction(async (tx) => {
            const mr = await tx.materialRequisition.findFirst({ where: { id, tenantId } });
            if (!mr)
                throw new Error('MR not found');
            const count = await tx.rFQ.count({ where: { tenantId } });
            const rfqNo = `RFQ-${(count + 1).toString().padStart(4, '0')}`;
            const rfq = await tx.rFQ.create({
                data: {
                    rfqNo,
                    mrId: id,
                    tenantId,
                    status: 'Open'
                }
            });
            await tx.materialRequisition.update({
                where: { id },
                data: { status: 'RFQ-Issued' }
            });
            return rfq;
        });
    }
};
exports.MaterialRequisitionsService = MaterialRequisitionsService;
exports.MaterialRequisitionsService = MaterialRequisitionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaterialRequisitionsService);
