import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prisma.document.findMany({
      where: { tenantId },
      include: { tenant: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async getOcrQueue(tenantId: string) {
    return this.prisma.document.findMany({
      where: { tenantId } // ocrStatus field doesn't exist in schema
    });
  }
}
