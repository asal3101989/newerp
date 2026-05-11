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
exports.RfqService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RfqService = class RfqService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.rFQ.findMany({
            where: { tenantId },
            include: { vendor: true, mr: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(tenantId, data) {
        const count = await this.prisma.rFQ.count({ where: { tenantId } });
        const rfqNo = `RFQ-${(count + 1).toString().padStart(4, '0')}`;
        return this.prisma.rFQ.create({
            data: { ...data, rfqNo, tenantId }
        });
    }
};
exports.RfqService = RfqService;
exports.RfqService = RfqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RfqService);
