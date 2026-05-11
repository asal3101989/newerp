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
exports.RecordsController = void 0;
const common_1 = require("@nestjs/common");
const records_service_1 = require("./records.service");
let RecordsController = class RecordsController {
    constructor(records) {
        this.records = records;
    }
    findAll(tenantId, module) {
        return this.records.findAll(tenantId, module);
    }
    create(tenantId, module, body) {
        return this.records.create(tenantId, module, body);
    }
    update(tenantId, module, id, body) {
        return this.records.update(tenantId, module, id, body);
    }
    remove(tenantId, module, id) {
        return this.records.remove(tenantId, module, id);
    }
};
exports.RecordsController = RecordsController;
__decorate([
    (0, common_1.Get)(":module"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Param)("module")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(":module"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Param)("module")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":module/:id"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Param)("module")),
    __param(2, (0, common_1.Param)("id")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":module/:id"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Param)("module")),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "remove", null);
exports.RecordsController = RecordsController = __decorate([
    (0, common_1.Controller)("tenants/:tenantId/records"),
    __param(0, (0, common_1.Inject)(records_service_1.RecordsService)),
    __metadata("design:paramtypes", [records_service_1.RecordsService])
], RecordsController);
