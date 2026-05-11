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
exports.ApprovalsController = void 0;
const common_1 = require("@nestjs/common");
const approvals_service_1 = require("./approvals.service");
let ApprovalsController = class ApprovalsController {
    constructor(approvals) {
        this.approvals = approvals;
    }
    findByTenant(tenantId) {
        return this.approvals.findByTenant(tenantId);
    }
    decide(tenantId, approvalId, status) {
        return this.approvals.decide(tenantId, approvalId, status);
    }
};
exports.ApprovalsController = ApprovalsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApprovalsController.prototype, "findByTenant", null);
__decorate([
    (0, common_1.Patch)(":approvalId/decision"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Param)("approvalId")),
    __param(2, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ApprovalsController.prototype, "decide", null);
exports.ApprovalsController = ApprovalsController = __decorate([
    (0, common_1.Controller)("tenants/:tenantId/approvals"),
    __metadata("design:paramtypes", [approvals_service_1.ApprovalsService])
], ApprovalsController);
