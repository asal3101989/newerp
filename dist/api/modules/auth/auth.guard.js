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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_service_1 = require("./auth.service");
const public_decorator_1 = require("./public.decorator");
let AuthGuard = class AuthGuard {
    constructor(auth, reflector) {
        this.auth = auth;
        this.reflector = reflector;
    }
    canActivate(context) {
        // Try both methods to read the metadata
        const handler = context.getHandler();
        const classRef = context.getClass();
        // Method 1: Using Reflector
        let isPublic = this.reflector?.getAllAndOverride(public_decorator_1.IS_PUBLIC_ROUTE, [handler, classRef]);
        // Method 2: Direct metadata read as fallback
        if (!isPublic) {
            isPublic = Reflect.getMetadata(public_decorator_1.IS_PUBLIC_ROUTE, classRef) || Reflect.getMetadata(public_decorator_1.IS_PUBLIC_ROUTE, handler);
        }
        const req = context.switchToHttp().getRequest();
        console.log(`[AUTH_GUARD_DEBUG] Path: ${req.url}, isPublic: ${isPublic}`);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const header = request.headers.authorization;
        const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
        if (!token) {
            throw new common_1.UnauthorizedException("Missing bearer token");
        }
        request.user = this.auth.verifyToken(token);
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        core_1.Reflector])
], AuthGuard);
