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
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../auth/public.decorator");
const compliance_service_1 = require("./compliance.service");
let ComplianceController = class ComplianceController {
    constructor(complianceService) {
        this.complianceService = complianceService;
    }
    validateGstin(tenantId, body) {
        return this.complianceService.validateGstin(body.gstin ?? "");
    }
    generateEInvoice(tenantId, body) {
        return this.complianceService.generateEInvoice(tenantId, body);
    }
    generateEWayBill(tenantId, body) {
        return this.complianceService.generateEWayBill(tenantId, body);
    }
    getGstrStatus(tenantId) {
        return this.complianceService.getGstrStatus(tenantId);
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("gst/validate"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "validateGstin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("einvoice/generate"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "generateEInvoice", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("eway-bill/generate"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "generateEWayBill", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("gstr/status"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "getGstrStatus", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, common_1.Controller)("tenants/:tenantId/compliance"),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService])
], ComplianceController);
