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
exports.RABillsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RABillsService = class RABillsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.rABill.findMany({
            where: { tenantId },
            include: { subcontractor: true, project: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findBySubcontractor(tenantId, subcontractorId) {
        return this.prisma.rABill.findMany({
            where: { tenantId, subcontractorId },
            orderBy: { billDate: 'desc' }
        });
    }
    async create(tenantId, data) {
        // 1. Calculate running totals and previous certified amounts
        const prevBills = await this.prisma.rABill.findMany({
            where: {
                tenantId,
                projectId: data.projectId,
                subcontractorId: data.subcontractorId,
                status: { in: ['Certified', 'Approved', 'Paid'] }
            },
            orderBy: { createdAt: 'desc' }
        });
        const prevGrossAmount = prevBills.length > 0 ? prevBills[0].grossAmount : 0;
        const currentGrossAmount = data.grossAmount; // Cumulative work done up to this bill
        const currentWorkDone = currentGrossAmount - prevGrossAmount;
        // 2. Automated Deduction Logic (Construction Standard)
        const retentionRate = 0.05; // 5% Retention
        const tdsRate = 0.02; // 2% TDS
        const retentionAmount = currentWorkDone * retentionRate;
        const tdsAmount = currentWorkDone * tdsRate;
        const advanceRecovery = data.advanceRecovery || 0;
        const otherDeductions = data.otherDeductions || 0;
        const netPayable = currentWorkDone - retentionAmount - tdsAmount - advanceRecovery - otherDeductions;
        // 3. Generate Bill Number
        const count = await this.prisma.rABill.count({ where: { tenantId } });
        const billNo = `RA-${(count + 1).toString().padStart(4, '0')}`;
        return this.prisma.rABill.create({
            data: {
                ...data,
                billNo,
                tenantId,
                prevAmount: prevGrossAmount,
                currentAmount: currentWorkDone,
                retentionAmount,
                tdsAmount,
                netPayable,
                status: 'Draft'
            }
        });
    }
    // Subcontractors
    async findAllSubcontractors(tenantId) {
        return this.prisma.subcontractor.findMany({ where: { tenantId } });
    }
    async createSubcontractor(tenantId, data) {
        return this.prisma.subcontractor.create({ data: { ...data, tenantId } });
    }
};
exports.RABillsService = RABillsService;
exports.RABillsService = RABillsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RABillsService);
