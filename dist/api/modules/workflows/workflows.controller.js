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
exports.WorkflowsController = void 0;
const common_1 = require("@nestjs/common");
const workflows_service_1 = require("./workflows.service");
let WorkflowsController = class WorkflowsController {
    constructor(workflows) {
        this.workflows = workflows;
    }
    findByTenant(tenantId) {
        return this.workflows.findByTenant(tenantId);
    }
    getEvents(tenantId) {
        return this.workflows.getEvents(tenantId);
    }
    simulate(tenantId, workflowId) {
        return this.workflows.simulate(tenantId, workflowId);
    }
};
exports.WorkflowsController = WorkflowsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "findByTenant", null);
__decorate([
    (0, common_1.Get)("events"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Post)(":workflowId/simulate"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Param)("workflowId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "simulate", null);
exports.WorkflowsController = WorkflowsController = __decorate([
    (0, common_1.Controller)("tenants/:tenantId/workflows"),
    __metadata("design:paramtypes", [workflows_service_1.WorkflowsService])
], WorkflowsController);
