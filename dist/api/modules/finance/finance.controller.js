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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const ra_bills_service_1 = require("./ra-bills.service");
let FinanceController = class FinanceController {
    constructor(finance, raBills) {
        this.finance = finance;
        this.raBills = raBills;
    }
    getSummary(tenantId) {
        return this.finance.getSummary(tenantId);
    }
    // Invoices
    findAllInvoices(tenantId) {
        return this.finance.findAllInvoices(tenantId);
    }
    createInvoice(tenantId, data) {
        return this.finance.createInvoice(tenantId, data);
    }
    // Bills
    findAllBills(tenantId) {
        return this.finance.findAllBills(tenantId);
    }
    createBill(tenantId, data) {
        return this.finance.createBill(tenantId, data);
    }
    // RA Bills
    findAllRABills(tenantId) {
        return this.raBills.findAll(tenantId);
    }
    createRABill(tenantId, data) {
        return this.raBills.create(tenantId, data);
    }
    // Subcontractors
    findAllSubcontractors(tenantId) {
        return this.raBills.findAllSubcontractors(tenantId);
    }
    createSubcontractor(tenantId, data) {
        return this.raBills.createSubcontractor(tenantId, data);
    }
    // Payments
    recordPayment(tenantId, data) {
        return this.finance.recordPayment(tenantId, data);
    }
    // Ledger
    getLedger(tenantId) {
        return this.finance.getLedger(tenantId);
    }
    createLedgerEntry(tenantId, data) {
        return this.finance.createLedgerEntry(tenantId, data);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)("summary"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)("invoices"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllInvoices", null);
__decorate([
    (0, common_1.Post)("invoices"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)("bills"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllBills", null);
__decorate([
    (0, common_1.Post)("bills"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createBill", null);
__decorate([
    (0, common_1.Get)("ra-bills"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllRABills", null);
__decorate([
    (0, common_1.Post)("ra-bills"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createRABill", null);
__decorate([
    (0, common_1.Get)("subcontractors"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllSubcontractors", null);
__decorate([
    (0, common_1.Post)("subcontractors"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createSubcontractor", null);
__decorate([
    (0, common_1.Post)("payments"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Get)("ledger"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getLedger", null);
__decorate([
    (0, common_1.Post)("ledger"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createLedgerEntry", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)("tenants/:tenantId/finance"),
    __metadata("design:paramtypes", [finance_service_1.FinanceService,
        ra_bills_service_1.RABillsService])
], FinanceController);
