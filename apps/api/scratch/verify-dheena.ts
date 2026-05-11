import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createHash } from 'node:crypto';

const connectionString = process.env['DATABASE_URL'] ?? 'postgresql://postgres:asaldaya@localhost:5432/nirmaancloud?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

function getHash(password: string) {
  // Matching the AuthService logic: createHash("sha256").update(value).digest("hex")
  return createHash('sha256').update(password).digest('hex');
}

async function verifyAndResetDheena() {
  const email = 'dheena@bcim.in';
  const password = 'Asal@1989';
  const tenantId = 'T-1000';

  try {
    const user = await (prisma as any).user.findFirst({
      where: { email, tenantId }
    });
    
    if (!user) {
      console.log(`User ${email} NOT FOUND. This shouldn't happen.`);
      return;
    }

    const expectedHash = getHash(password);
    console.log(`Setting password for ${email} to ${password}`);
    console.log(`Target Hash (SHA256): ${expectedHash}`);

    await (prisma as any).user.update({
      where: { id: user.id },
      data: { passwordHash: expectedHash }
    });
    
    console.log(`Update complete.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

verifyAndResetDheena();
