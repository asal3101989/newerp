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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(input) {
        console.log('[AUTH_DEBUG] AuthService.login called for:', { tenantId: input.tenantId, email: input.email });
        const user = await this.prisma.user.findFirst({
            where: {
                tenantId: input.tenantId,
                email: input.email,
            },
            include: {
                tenant: true,
                role: {
                    include: {
                        permissions: {
                            include: { permission: true }
                        }
                    }
                }
            }
        });
        console.log('[AUTH_DEBUG] Database user lookup:', user ? { id: user.id, email: user.email, tenantId: user.tenantId } : 'USER NOT FOUND');
        const inputHash = this.hash(input.password);
        console.log('[AUTH_DEBUG] Password check:', {
            inputHash,
            storedHash: user?.passwordHash,
            match: user?.passwordHash === inputHash
        });
        if (!user || user.passwordHash !== inputHash) {
            throw new common_1.NotFoundException("Invalid tenant, email, or password");
        }
        const permissions = user.role?.permissions?.map(rp => rp.permission.code) || [];
        const token = this.sign({
            sub: user.id,
            tenantId: user.tenantId,
            role: user.roleId ?? "User",
            permissions: permissions
        });
        return {
            accessToken: token,
            tokenType: "Bearer",
            tenant: user.tenant,
            user: {
                id: user.id,
                name: user.name,
                role: user.roleId ?? "User",
                department: user.department || "Operations",
                permissions: permissions,
                mfaRequired: false
            }
        };
    }
    hash(value) {
        return (0, node_crypto_1.createHash)("sha256").update(value).digest("hex");
    }
    sign(payload) {
        const header = this.base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const body = this.base64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
        const secret = process.env.JWT_SECRET ?? "dev-secret-change-me";
        const signature = (0, node_crypto_1.createHmac)("sha256", secret).update(`${header}.${body}`).digest("base64url");
        return `${header}.${body}.${signature}`;
    }
    verifyToken(token) {
        const [header, body, signature] = token.split(".");
        if (!header || !body || !signature) {
            throw new common_1.UnauthorizedException("Invalid token");
        }
        const secret = process.env.JWT_SECRET ?? "dev-secret-change-me";
        const expected = (0, node_crypto_1.createHmac)("sha256", secret).update(`${header}.${body}`).digest("base64url");
        if (expected !== signature) {
            throw new common_1.UnauthorizedException("Invalid token signature");
        }
        try {
            return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
        }
        catch {
            throw new common_1.UnauthorizedException("Invalid token payload");
        }
    }
    base64url(value) {
        return Buffer.from(value).toString("base64url");
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
