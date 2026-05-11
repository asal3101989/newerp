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

async function resetPasswords() {
  const email = 'it@bcim.in';
  const tenantId = 'T-1000';
  const password = 'BCIM@2026#IT';

  try {
    console.log(`Diagnostic: Finding user with email: ${email}...`);
    
    // Find all users to be sure
    const allUsers = await (prisma as any).user.findMany({
      select: { id: true, email: true, tenantId: true }
    });
    console.log('Current users in DB:', allUsers);

    const user = await (prisma as any).user.findFirst({
      where: { email }
    });
    
    if (!user) {
      console.log(`User ${email} NOT FOUND in database.`);
      return;
    }

    console.log(`Found user ID: ${user.id}. Resetting password...`);

    await (prisma as any).user.update({
      where: { id: user.id },
      data: { passwordHash: getHash(password) }
    });
    
    console.log(`Successfully reset password for ${email} to: ${password}`);
  } catch (error) {
    console.error('Error resetting passwords:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

resetPasswords();
