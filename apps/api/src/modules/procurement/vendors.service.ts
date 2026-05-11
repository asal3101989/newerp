import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.vendor.findMany({ where: { tenantId } });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.vendor.findFirst({ where: { id, tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.vendor.create({
      data: { ...data, tenantId }
    });
  }

  async update(tenantId: string, id: string, data: any) {
    return this.prisma.vendor.update({
      where: { id, tenantId },
      data
    });
  }

  async remove(tenantId: string, id: string) {
    return this.prisma.vendor.delete({
      where: { id, tenantId }
    });
  }
}
