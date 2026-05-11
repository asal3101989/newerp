import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tenant.findMany();
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException(`Tenant ${id} not found`);
    return tenant;
  }
}
