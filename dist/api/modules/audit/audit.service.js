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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
let AuditService = AuditService_1 = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AuditService_1.name);
    }
    async findByTenant(tenantId) {
        return this.prisma.auditEvent.findMany({
            where: { tenantId },
            orderBy: { createdAt: "desc" },
            take: 200
        });
    }
    async log(tenantId, entity, action, entityId, userId, metadata) {
        return this.prisma.auditEvent.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                tenantId,
                entity,
                action,
                entityId,
                userId,
                after: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
            }
        });
    }
    async cleanup(retentionDays = 90) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - retentionDays);
        const result = await this.prisma.auditEvent.deleteMany({
            where: { createdAt: { lt: cutoff } }
        });
        this.logger.log(`Audit cleanup: deleted ${result.count} events older than ${retentionDays} days`);
        return result;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
