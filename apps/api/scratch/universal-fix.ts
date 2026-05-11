import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createHash } from 'node:crypto';

const connectionString = process.env['DATABASE_URL'] ?? 'postgresql://postgres:asaldaya@localhost:5432/nirmaancloud?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

function getHash(password: string) {
  // Matching AuthService exactly: createHash("sha256").update(value).digest("hex")
  return createHash('sha256').update(password).digest('hex');
}

async function fixUsers() {
  const tenantId = 'T-1000';
  const email = 'dheena@bcim.in';
  const password = 'Asal@1989';
  const targetHash = getHash(password);

  try {
    console.log(`--- Starting User Fix Diagnostic ---`);
    
    // 1. List all users for context
    const allUsers = await (prisma as any).user.findMany({
      select: { id: true, email: true, tenantId: true }
    });
    console.log('Current users in DB:', allUsers);

    // 2. Ensure Admin Role exists
    let role = await (prisma as any).role.findFirst({
      where: { tenantId, name: 'System Administrator' }
    });
    
    if (!role) {
      console.log('Admin role missing, finding first available role...');
      role = await (prisma as any).role.findFirst({ where: { tenantId } });
    }

    // 3. Upsert Dheena's user
    console.log(`Targeting user: ${email} for tenant ${tenantId}`);
    
    const user = await (prisma as any).user.upsert({
      where: { email },
      update: {
        passwordHash: targetHash,
        tenantId: tenantId,
        roleId: role?.id
      },
      create: {
        id: `usr-admin-${Date.now().toString().slice(-4)}`,
        email: email,
        name: 'Dheena Admin',
        passwordHash: targetHash,
        tenantId: tenantId,
        roleId: role?.id,
        department: 'Management'
      }
    });

    console.log(`Successfully fixed user: ${user.email}`);
    console.log(`Expected Hash: ${targetHash}`);
    console.log(`Verify this hash matches what the login button sends.`);

  } catch (error) {
    console.error('ERROR fixing users:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

fixUsers();
