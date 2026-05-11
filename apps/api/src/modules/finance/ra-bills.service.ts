import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RABillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.rABill.findMany({
      where: { tenantId },
      include: { subcontractor: true, project: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findBySubcontractor(tenantId: string, subcontractorId: string) {
    return this.prisma.rABill.findMany({
      where: { tenantId, subcontractorId },
      orderBy: { billDate: 'desc' }
    });
  }

  async create(tenantId: string, data: any) {
    // 1. Calculate running totals and previous certified amounts
    const prevBills = await this.prisma.rABill.findMany({
      where: { 
        tenantId, 
        projectId: data.projectId, 
        subcontractorId: data.subcontractorId,
        status: { in: ['Certified', 'Approved', 'Paid'] }
      },
      orderBy: { createdAt: 'desc' }
    });

    const prevGrossAmount = prevBills.length > 0 ? prevBills[0].grossAmount : 0;
    const currentGrossAmount = data.grossAmount; // Cumulative work done up to this bill
    const currentWorkDone = currentGrossAmount - prevGrossAmount;

    // 2. Automated Deduction Logic (Construction Standard)
    const retentionRate = 0.05; // 5% Retention
    const tdsRate = 0.02;      // 2% TDS
    
    const retentionAmount = currentWorkDone * retentionRate;
    const tdsAmount = currentWorkDone * tdsRate;
    const advanceRecovery = data.advanceRecovery || 0;
    const otherDeductions = data.otherDeductions || 0;

    const netPayable = currentWorkDone - retentionAmount - tdsAmount - advanceRecovery - otherDeductions;

    // 3. Generate Bill Number
    const count = await this.prisma.rABill.count({ where: { tenantId } });
    const billNo = `RA-${(count + 1).toString().padStart(4, '0')}`;

    return this.prisma.rABill.create({
      data: {
        ...data,
        billNo,
        tenantId,
        prevAmount: prevGrossAmount,
        currentAmount: currentWorkDone,
        retentionAmount,
        tdsAmount,
        netPayable,
        status: 'Draft'
      }
    });
  }

  // Subcontractors
  async findAllSubcontractors(tenantId: string) {
    return this.prisma.subcontractor.findMany({ where: { tenantId } });
  }

  async createSubcontractor(tenantId: string, data: any) {
    return this.prisma.subcontractor.create({ data: { ...data, tenantId } });
  }
}
