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
exports.ProcurementController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const procurement_service_1 = require("./procurement.service");
const vendors_service_1 = require("./vendors.service");
const material_requisitions_service_1 = require("./material-requisitions.service");
const rfq_service_1 = require("./rfq.service");
const grn_service_1 = require("./grn.service");
let ProcurementController = class ProcurementController {
    constructor(procurement, vendors, mrs, rfqs, grns) {
        this.procurement = procurement;
        this.vendors = vendors;
        this.mrs = mrs;
        this.rfqs = rfqs;
        this.grns = grns;
    }
    async getSummary(tenantId) {
        const [mrs, rfqs, pos] = await Promise.all([
            this.mrs.findAll(tenantId),
            this.rfqs.findAll(tenantId),
            this.procurement.findAllPos(tenantId)
        ]);
        return {
            counts: {
                mrPending: mrs.filter(m => m.status === "Pending").length,
                rfqActive: rfqs.filter(r => r.status === "Draft" || r.status === "Quoted").length,
                poApproval: pos.filter(p => p.status === "Draft" || p.status === "Review").length,
                total: mrs.length + rfqs.length + pos.length
            },
            // Fallback for summary list
            recentPos: pos.slice(0, 10).map(p => ({
                id: p.id,
                item: p.id.substring(0, 8),
                vendorRecommendation: p.vendor?.name || "Unknown",
                nextAction: p.status,
                requiredQty: "PO"
            }))
        };
    }
    // Purchase Orders
    findAllPos(tenantId) {
        return this.procurement.findAllPos(tenantId);
    }
    createPo(tenantId, data) {
        return this.procurement.createPo(tenantId, data);
    }
    // Vendors
    findAllVendors(tenantId) {
        return this.vendors.findAll(tenantId);
    }
    createVendor(tenantId, data) {
        return this.vendors.create(tenantId, data);
    }
    // Material Requisitions
    findAllMrs(tenantId) {
        return this.mrs.findAll(tenantId);
    }
    createMr(tenantId, data) {
        return this.mrs.create(tenantId, data);
    }
    // RFQs
    findAllRfqs(tenantId) {
        return this.rfqs.findAll(tenantId);
    }
    createRfq(tenantId, data) {
        return this.rfqs.create(tenantId, data);
    }
    // GRNs
    findAllGrns(tenantId) {
        return this.grns.findAll(tenantId);
    }
    createGrn(tenantId, data) {
        return this.grns.create(tenantId, data);
    }
};
exports.ProcurementController = ProcurementController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProcurementController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)("pos"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findAllPos", null);
__decorate([
    (0, common_1.Post)("pos"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createPo", null);
__decorate([
    (0, common_1.Get)("vendors"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findAllVendors", null);
__decorate([
    (0, common_1.Post)("vendors"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createVendor", null);
__decorate([
    (0, common_1.Get)("mrs"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findAllMrs", null);
__decorate([
    (0, common_1.Post)("mrs"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createMr", null);
__decorate([
    (0, common_1.Get)("rfqs"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findAllRfqs", null);
__decorate([
    (0, common_1.Post)("rfqs"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createRfq", null);
__decorate([
    (0, common_1.Get)("grns"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findAllGrns", null);
__decorate([
    (0, common_1.Post)("grns"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createGrn", null);
exports.ProcurementController = ProcurementController = __decorate([
    (0, common_1.Controller)("tenants/:tenantId/procurement"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [procurement_service_1.ProcurementService,
        vendors_service_1.VendorsService,
        material_requisitions_service_1.MaterialRequisitionsService,
        rfq_service_1.RfqService,
        grn_service_1.GrnService])
], ProcurementController);
