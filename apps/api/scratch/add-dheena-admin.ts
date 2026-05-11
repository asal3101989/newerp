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

async function addAdminUser() {
  const email = 'dheena@bcim.in';
  const password = 'Asal@1989';
  const tenantId = 'T-1000';
  const name = 'Dheena (Admin)';
  
  try {
    console.log(`Adding admin user: ${email}...`);
    
    // 1. Find Admin Role
    const role = await (prisma as any).role.findFirst({
      where: { tenantId, name: 'System Administrator' }
    });
    
    if (!role) {
      console.error('System Administrator role not found for tenant T-1000. Please run seed first.');
      return;
    }

    const passwordHash = getHash(password);
    
    // 2. Upsert User
    const user = await (prisma as any).user.upsert({
      where: { email },
      update: {
        passwordHash,
        roleId: role.id,
        tenantId
      },
      create: {
        id: `usr-dheena-${Date.now().toString().slice(-4)}`,
        email,
        name,
        passwordHash,
        tenantId,
        roleId: role.id,
        department: 'Management'
      }
    });
    
    console.log(`Successfully added/updated admin user: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${role.name}`);
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

addAdminUser();
