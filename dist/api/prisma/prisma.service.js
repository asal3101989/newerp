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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const connectionString = process.env['DATABASE_URL'] ?? 'postgresql://postgres:asaldaya@localhost:5432/nirmaancloud?schema=public';
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({ adapter });
    }
    async onModuleInit() {
        try {
            console.log('[PRISMA] Connecting to database...');
            await this.$connect();
            console.log('[PRISMA] Database connected successfully');
            await this.seed();
            console.log('[PRISMA] Database seeding completed');
        }
        catch (error) {
            console.error('[PRISMA] Failed to initialize database:', error);
            throw error;
        }
    }
    async seed() {
        const defaultTenantId = 'T-1000';
        let tenant;
        try {
            tenant = await this.tenant.findUnique({ where: { id: defaultTenantId } });
        }
        catch {
            tenant = null;
        }
        if (!tenant) {
            try {
                tenant = await this.tenant.create({
                    data: {
                        id: defaultTenantId,
                        name: 'NirmaanCloud Demo',
                        gstin: '27AABCU9603R1ZM',
                        plan: 'enterprise',
                    }
                });
            }
            catch (e) {
                console.warn('Seed: Could not create tenant', e);
                return;
            }
        }
        // Create a default role
        const roleName = 'CFO';
        let role;
        try {
            role = await this.role.findFirst({ where: { tenantId: defaultTenantId, name: roleName } });
        }
        catch {
            role = null;
        }
        if (!role) {
            try {
                role = await this.role.create({
                    data: {
                        id: 'role-cfo',
                        tenantId: defaultTenantId,
                        name: roleName,
                        level: 10,
                    }
                });
            }
            catch (e) {
                console.warn('Seed: Could not create role', e);
            }
        }
        // Create default user
        const defaultEmail = 'cfo@bcimerp.com';
        let user;
        try {
            user = await this.user.findFirst({ where: { tenantId: defaultTenantId, email: defaultEmail } });
        }
        catch {
            user = null;
        }
        if (!user && role) {
            try {
                const crypto = require('crypto');
                const hash = crypto.createHash('sha256').update('Nirmaan@123').digest('hex');
                user = await this.user.create({
                    data: {
                        id: 'user-cfo',
                        tenantId: defaultTenantId,
                        roleId: role.id,
                        name: 'Ananya Mehta (CFO)',
                        email: defaultEmail,
                        department: 'Finance',
                        passwordHash: hash,
                    }
                });
            }
            catch (e) {
                console.warn('Seed: Could not create user', e);
            }
        }
        console.log('✅ Database seeded successfully for tenant:', defaultTenantId);
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
