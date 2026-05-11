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
  const resets = [
    { email: 'it@bcim.in', password: 'BCIM@2026#IT' },
    { email: 'cfo@bcimerp.com', password: 'Nirmaan@123' },
    { email: 'procurement@bcim.in', password: 'Nirmaan@Procure123' }
  ];

  try {
    for (const r of resets) {
      console.log(`Resetting password for: ${r.email}...`);
      
      const user = await (prisma as any).user.findFirst({
        where: { email: r.email }
      });
      
      if (!user) {
        console.log(`User ${r.email} not found, skipping.`);
        continue;
      }

      await (prisma as any).user.update({
        where: { id: user.id },
        data: { passwordHash: getHash(r.password) }
      });
      
      console.log(`Successfully reset password for ${r.email} to: ${r.password}`);
    }
    
    console.log('\n--- Password reset complete ---');
  } catch (error) {
    console.error('Error resetting passwords:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

resetPasswords();
