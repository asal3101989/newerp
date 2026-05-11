import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env['DATABASE_URL'] ?? 'postgresql://postgres:asaldaya@localhost:5432/nirmaancloud?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ adapter } as any);
  }

  async onModuleInit() {
    try {
      console.log('[PRISMA] Connecting to database...');
      await this.$connect();
      console.log('[PRISMA] Database connected successfully');
      await this.seed();
      console.log('[PRISMA] Database seeding completed');
    } catch (error) {
      console.error('[PRISMA] Failed to initialize database:', error);
      throw error;
    }
  }

  private async seed() {
    const defaultTenantId = 'T-1000';
    let tenant: any;
    try {
      tenant = await (this as any).tenant.findUnique({ where: { id: defaultTenantId } });
    } catch {
      tenant = null;
    }
    if (!tenant) {
      try {
        tenant = await (this as any).tenant.create({
          data: {
            id: defaultTenantId,
            name: 'NirmaanCloud Demo',
            gstin: '27AABCU9603R1ZM',
            plan: 'enterprise',
          }
        });
      } catch (e) {
        console.warn('Seed: Could not create tenant', e);
        return;
      }
    }

    // Create a default role
    const roleName = 'CFO';
    let role: any;
    try {
      role = await (this as any).role.findFirst({ where: { tenantId: defaultTenantId, name: roleName } });
    } catch { role = null; }
    if (!role) {
      try {
        role = await (this as any).role.create({
          data: {
            id: 'role-cfo',
            tenantId: defaultTenantId,
            name: roleName,
            level: 10,
          }
        });
      } catch (e) {
        console.warn('Seed: Could not create role', e);
      }
    }

    // Create default user
    const defaultEmail = 'cfo@bcimerp.com';
    let user: any;
    try {
      user = await (this as any).user.findFirst({ where: { tenantId: defaultTenantId, email: defaultEmail } });
    } catch { user = null; }
    if (!user && role) {
      try {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update('Nirmaan@123').digest('hex');
        user = await (this as any).user.create({
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
      } catch (e) {
        console.warn('Seed: Could not create user', e);
      }
    }

    console.log('✅ Database seeded successfully for tenant:', defaultTenantId);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
