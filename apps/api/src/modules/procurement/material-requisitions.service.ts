import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MaterialRequisitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.materialRequisition.findMany({ 
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(tenantId: string, data: any) {
    const count = await this.prisma.materialRequisition.count({ where: { tenantId } });
    const mrNo = `MR-${(count + 1).toString().padStart(4, '0')}`;
    return this.prisma.materialRequisition.create({
      data: { 
        ...data, 
        mrNo,
        tenantId,
        items: typeof data.items === 'string' ? data.items : JSON.stringify(data.items)
      }
    });
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    return this.prisma.materialRequisition.update({
      where: { id, tenantId },
      data: { status }
    });
  }

  async convertToRfq(tenantId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const mr = await tx.materialRequisition.findFirst({ where: { id, tenantId } });
      if (!mr) throw new Error('MR not found');

      const count = await tx.rFQ.count({ where: { tenantId } });
      const rfqNo = `RFQ-${(count + 1).toString().padStart(4, '0')}`;

      const rfq = await tx.rFQ.create({
        data: {
          rfqNo,
          mrId: id,
          tenantId,
          status: 'Open'
        }
      });

      await tx.materialRequisition.update({
        where: { id },
        data: { status: 'RFQ-Issued' }
      });

      return rfq;
    });
  }
}
