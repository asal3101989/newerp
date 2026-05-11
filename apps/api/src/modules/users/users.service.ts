import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: { id: true, name: true, role: true, email: true, tenantId: true, createdAt: true }
    });
  }

  async getRolePermissions(tenantId: string) {
    const users = await this.findByTenant(tenantId);
    return users.map((user) => ({
      userId: user.id,
      name: user.name,
      role: user.role,
      department: "Operations",
      permissions: ["read:projects", "write:dpr"]
    }));
  }
}
