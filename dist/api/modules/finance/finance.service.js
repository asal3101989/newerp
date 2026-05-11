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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FinanceService = class FinanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(tenantId) {
        const [invoices, bills, bankAccounts] = await Promise.all([
            this.prisma.invoice.findMany({ where: { tenantId, status: { not: 'Paid' } } }),
            this.prisma.bill.findMany({ where: { tenantId, status: { not: 'Paid' } } }),
            this.prisma.bankAccount.findMany({ where: { tenantId } })
        ]);
        // Values in Crores (1Cr = 10,000,000)
        const arOutstandingCr = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0) / 10000000;
        const apOutstandingCr = bills.reduce((sum, bill) => sum + bill.totalAmount, 0) / 10000000;
        const bankBalanceCr = bankAccounts.reduce((sum, bank) => sum + bank.balance, 0) / 10000000;
        return {
            cashflowDays: 45,
            vendorDuesCr: apOutstandingCr,
            gstLiabilityCr: apOutstandingCr * 0.18,
            bankBalanceCr,
            revenueThisMonthCr: 0,
            arOutstandingCr,
            apOutstandingCr,
            updatedAt: new Date()
        };
    }
    // Invoices (AR)
    async findAllInvoices(tenantId) {
        return this.prisma.invoice.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
    }
    async createInvoice(tenantId, data) {
        return this.prisma.invoice.create({ data: { ...data, tenantId } });
    }
    // Bills (AP)
    async findAllBills(tenantId) {
        return this.prisma.bill.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
    }
    async createBill(tenantId, data) {
        return this.prisma.bill.create({ data: { ...data, tenantId } });
    }
    // Payments
    async recordPayment(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.paymentTransaction.create({ data: { ...data, tenantId } });
            // Update Invoice/Bill status if linked
            if (data.invoiceId) {
                await tx.invoice.update({ where: { id: data.invoiceId }, data: { status: 'Paid' } });
            }
            if (data.billId) {
                await tx.bill.update({ where: { id: data.billId }, data: { status: 'Paid' } });
            }
            return payment;
        });
    }
    // Ledger
    async getLedger(tenantId) {
        return this.prisma.ledgerEntry.findMany({ where: { tenantId }, orderBy: { date: 'desc' } });
    }
    async createLedgerEntry(tenantId, data) {
        return this.prisma.ledgerEntry.create({ data: { ...data, tenantId } });
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
