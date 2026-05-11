import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:asaldaya@localhost:5432/nirmaancloud?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);
const tenantId = "T-1000";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  // 1. Create Core Tenant
  await prisma.tenant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: "NirmaanCloud Production",
      gstin: "27AABCN0000A1Z5",
      plan: "enterprise"
    }
  });

  // 2. Setup Permissions
  const permissionCodes = [
    ["project.view", "View project records"],
    ["dpr.approve", "Approve DPR submissions"],
    ["po.approve", "Approve purchase orders"],
    ["finance.approve", "Approve finance transactions"],
    ["audit.view", "View audit trail"],
    ["admin.manage", "Manage organization setup"],
    ["crm.view", "View CRM records"],
    ["tender.view", "View tendering and estimation"],
    ["inventory.view", "View inventory and stores"],
    ["ra_bill.verify", "Verify RA bills and contractor billing"],
    ["labour.view", "View labour management"],
    ["machinery.view", "View plant and machinery"],
    ["quality.view", "View QA/QC"],
    ["safety.view", "View EHS"],
    ["payroll.view", "View payroll and HRMS"],
    ["documents.view", "View document management"],
    ["customer.view", "View customer portal"],
    ["facility.view", "View asset and facility"],
    ["analytics.view", "View analytics"],
    ["workflow.manage", "Manage workflows"],
    ["mobile.view", "View mobile operations"],
    ["ai.use", "Use AI automation"]
  ];

  for (const [code, description] of permissionCodes) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { id: `perm-${code.replace(".", "-")}`, code, description }
    });
  }

  // 3. Setup Roles
  await prisma.role.upsert({
    where: { tenantId_name: { tenantId, name: "System Administrator" } },
    update: {},
    create: { id: "role-admin", tenantId, name: "System Administrator", level: 100 }
  });

  await prisma.role.upsert({
    where: { tenantId_name: { tenantId, name: "Project Manager" } },
    update: {},
    create: { id: "role-pm", tenantId, name: "Project Manager", level: 70 }
  });

  await prisma.role.upsert({
    where: { tenantId_name: { tenantId, name: "Store Keeper" } },
    update: {},
    create: { id: "role-store", tenantId, name: "Store Keeper", level: 45 }
  });

  // Map permissions to System Administrator
  const adminCodes = permissionCodes.map(([code]) => code);
  for (const code of adminCodes) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: "role-admin", permissionId: `perm-${code.replace(".", "-")}` } },
      update: {},
      create: { roleId: "role-admin", permissionId: `perm-${code.replace(".", "-")}` }
    });
  }

  // 4. Create Core Admin User
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId, email: "it@bcim.in" } },
    update: {
      passwordHash: hashPassword("BCIM@2026@IT")
    },
    create: {
      id: "usr-admin",
      tenantId,
      roleId: "role-admin",
      name: "IT Administrator",
      email: "it@bcim.in",
      phone: "+910000000000",
      department: "IT",
      passwordHash: hashPassword("BCIM@2026@IT"),
      mfaEnabled: true
    }
  });

  console.log("✅ Core foundation seeded successfully for tenant:", tenantId);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

