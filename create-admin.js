require('dotenv').config();
const { Client } = require('pg');
const { createHash, randomBytes } = require('crypto');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:asaldaya@localhost:5432/nirmaancloud'
});

function generateUUID() {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function createAdmin() {
  try {
    await client.connect();
    console.log('[CONNECTED] Connected to PostgreSQL');

    const tenantId = 'T-1000';
    const email = 'admin@bcim.in';
    const password = 'Admin@2026';
    const name = 'Admin User';
    const passwordHash = createHash('sha256').update(password).digest('hex');

    console.log(`\n[CREATE] Creating admin user...`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Tenant: ${tenantId}`);

    // Find admin role
    const roleResult = await client.query(
      'SELECT id FROM "Role" WHERE "tenantId" = $1 AND name = $2 LIMIT 1',
      [tenantId, 'Admin']
    );

    let roleId;
    if (roleResult.rows.length > 0) {
      roleId = roleResult.rows[0].id;
      console.log(`\n[FOUND] Admin role: ${roleId}`);
    } else {
      console.log('\n[INFO] Admin role not found, will create without role');
      roleId = null;
    }

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log(`\n[UPDATE] User exists, updating password and role...`);
      await client.query(
        'UPDATE "User" SET "passwordHash" = $1, "roleId" = $2, "updatedAt" = NOW() WHERE email = $3',
        [passwordHash, roleId, email]
      );
    } else {
      console.log(`\n[INSERT] Creating new admin user...`);
      const userId = generateUUID();
      await client.query(
        'INSERT INTO "User" ("id", "email", "passwordHash", "name", "tenantId", "roleId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [userId, email, passwordHash, name, tenantId, roleId]
      );
    }

    console.log(`\n[SUCCESS] Admin user created/updated!`);
    console.log(`\n========================================`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     Admin`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error('[ERROR]', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdmin();
