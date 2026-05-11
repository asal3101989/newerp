"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcurementModule = void 0;
const common_1 = require("@nestjs/common");
const procurement_controller_1 = require("./procurement.controller");
const procurement_service_1 = require("./procurement.service");
const vendors_service_1 = require("./vendors.service");
const material_requisitions_service_1 = require("./material-requisitions.service");
const rfq_service_1 = require("./rfq.service");
const grn_service_1 = require("./grn.service");
const inventory_module_1 = require("../inventory/inventory.module");
let ProcurementModule = class ProcurementModule {
};
exports.ProcurementModule = ProcurementModule;
exports.ProcurementModule = ProcurementModule = __decorate([
    (0, common_1.Module)({
        imports: [inventory_module_1.InventoryModule],
        controllers: [procurement_controller_1.ProcurementController],
        providers: [
            procurement_service_1.ProcurementService,
            vendors_service_1.VendorsService,
            material_requisitions_service_1.MaterialRequisitionsService,
            rfq_service_1.RfqService,
            grn_service_1.GrnService
        ]
    })
], ProcurementModule);
