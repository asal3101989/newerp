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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../auth/public.decorator");
const ai_service_1 = require("./ai.service");
let AiController = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    getInsights(tenantId) {
        return this.aiService.getInsights(tenantId);
    }
    processOcr(tenantId, body) {
        return this.aiService.processOcr(tenantId, body.fileName);
    }
    generateForecast(tenantId, body) {
        return this.aiService.generateForecast(tenantId, body.domain ?? "cashflow");
    }
    chat(tenantId, body) {
        return this.aiService.chat(tenantId, body.messages ?? [], body.context);
    }
};
exports.AiController = AiController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("insights"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getInsights", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("ocr"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "processOcr", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("forecast"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateForecast", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("chat"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "chat", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)("tenants/:tenantId/ai"),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
