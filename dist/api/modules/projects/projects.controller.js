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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
let ProjectsController = class ProjectsController {
    constructor(projects) {
        this.projects = projects;
    }
    findByTenant(tenantId) {
        return this.projects.findByTenant(tenantId);
    }
    getHealth(tenantId) {
        return this.projects.getHealth(tenantId);
    }
    findOne(tenantId, projectId) {
        return this.projects.findOne(tenantId, projectId);
    }
    create(tenantId, data) {
        return this.projects.create(tenantId, data);
    }
    update(tenantId, projectId, data) {
        return this.projects.update(tenantId, projectId, data);
    }
    remove(tenantId, projectId) {
        return this.projects.remove(tenantId, projectId);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findByTenant", null);
__decorate([
    (0, common_1.Get)("health"),
    __param(0, (0, common_1.Param)("tenantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)(":projectId"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Param)("projectId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":projectId"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Param)("projectId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":projectId"),
    __param(0, (0, common_1.Param)("tenantId")),
    __param(1, (0, common_1.Param)("projectId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)("tenants/:tenantId/projects"),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
