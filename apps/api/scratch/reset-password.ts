import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createHash } from 'node:crypto';

const connectionString = process.env['DATABASE_URL'] ?? 'postgresql://postgres:asaldaya@localhost:5432/nirmaancloud?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function resetPassword() {
  const email = 'it@bcim.in';
  const tenantId = 'T-1000';
  const newPassword = 'BCIM@2026#IT';
  
  const passwordHash = createHash('sha256').update(newPassword).digest('hex');
  
  try {
    const user = await prisma.user.findFirst({
      where: { email, tenantId }
    });
    
    if (!user) {
      console.log(`User ${email} in tenant ${tenantId} not found, checking for existing users...`);
      const allUsers = await prisma.user.findMany({ select: { email: true, tenantId: true } });
      console.log('Available users:', allUsers);
      return;
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });
    
    console.log(`Password reset successful for ${email} in tenant ${tenantId}`);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

resetPassword();
