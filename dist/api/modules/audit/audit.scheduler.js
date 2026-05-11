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
var AuditScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const audit_service_1 = require("./audit.service");
let AuditScheduler = AuditScheduler_1 = class AuditScheduler {
    constructor(auditService) {
        this.auditService = auditService;
        this.logger = new common_1.Logger(AuditScheduler_1.name);
    }
    // Runs every day at 2:00 AM
    async handleDailyCleanup() {
        this.logger.log("Running daily audit log cleanup...");
        const retentionDays = Number(process.env.AUDIT_RETENTION_DAYS ?? 90);
        await this.auditService.cleanup(retentionDays);
    }
};
exports.AuditScheduler = AuditScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditScheduler.prototype, "handleDailyCleanup", null);
exports.AuditScheduler = AuditScheduler = AuditScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditScheduler);
