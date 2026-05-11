import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RfqService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.rFQ.findMany({ 
      where: { tenantId },
      include: { vendor: true, mr: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(tenantId: string, data: any) {
    const count = await this.prisma.rFQ.count({ where: { tenantId } });
    const rfqNo = `RFQ-${(count + 1).toString().padStart(4, '0')}`;
    return this.prisma.rFQ.create({
      data: { ...data, rfqNo, tenantId }
    });
  }
}
