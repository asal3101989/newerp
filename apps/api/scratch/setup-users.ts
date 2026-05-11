import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createHash } from 'node:crypto';

const connectionString = process.env['DATABASE_URL'] ?? 'postgresql://postgres:asaldaya@localhost:5432/nirmaancloud?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

function getHash(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

async function setupUsers() {
  const tenantId = 'T-1000';
  const usersToCreate = [
    {
      id: 'user-it',
      name: 'IT Admin',
      email: 'it@bcim.in',
      password: 'BCIM@2026#IT',
      department: 'IT',
      roleName: 'System Administrator'
    },
    {
      id: 'user-procurement',
      name: 'Procurement Head',
      email: 'procurement@bcim.in',
      password: 'Nirmaan@Procure123',
      department: 'Procurement',
      roleName: 'Procurement Manager'
    },
    {
      id: 'user-cfo-new',
      name: 'Ananya Mehta (CFO)',
      email: 'cfo@bcimerp.com',
      password: 'Nirmaan@123',
      department: 'Finance',
      roleName: 'CFO'
    }
  ];

  try {
    for (const u of usersToCreate) {
      console.log(`Processing user: ${u.email}...`);
      
      // Ensure role exists or find one
      let role = await (prisma as any).role.findFirst({
        where: { tenantId, name: u.roleName }
      });
      
      if (!role) {
        console.log(`Role ${u.roleName} not found, using first available role...`);
        role = await (prisma as any).role.findFirst({ where: { tenantId } });
      }

      const passwordHash = getHash(u.password);
      
      await (prisma as any).user.upsert({
        where: { id: u.id },
        update: {
          passwordHash,
          email: u.email,
          tenantId
        },
        create: {
          id: u.id,
          name: u.name,
          email: u.email,
          tenantId,
          passwordHash,
          department: u.department,
          roleId: role?.id
        }
      });
      
      console.log(`Successfully setup user: ${u.email} with password: ${u.password}`);
    }
    
    console.log('\n--- All users processed successfully ---');
  } catch (error) {
    console.error('Error setting up users:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

setupUsers();
