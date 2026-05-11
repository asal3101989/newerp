import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPos(tenantId: string) {
    return this.prisma.purchaseOrder.findMany({ 
      where: { tenantId },
      include: { vendor: true, material: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPo(tenantId: string, data: any) {
    const count = await this.prisma.purchaseOrder.count({ where: { tenantId } });
    const poNumber = `PO-${(count + 1).toString().padStart(4, '0')}`;
    
    return this.prisma.purchaseOrder.create({
      data: {
        ...data,
        poNumber,
        tenantId
      }
    });
  }

  async updatePoStatus(tenantId: string, id: string, status: string) {
    return this.prisma.purchaseOrder.update({
      where: { id, tenantId },
      data: { status }
    });
  }
}
