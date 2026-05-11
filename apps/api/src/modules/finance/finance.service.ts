import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(tenantId: string) {
    const [invoices, bills, bankAccounts] = await Promise.all([
      this.prisma.invoice.findMany({ where: { tenantId, status: { not: 'Paid' } } }),
      this.prisma.bill.findMany({ where: { tenantId, status: { not: 'Paid' } } }),
      this.prisma.bankAccount.findMany({ where: { tenantId } })
    ]);

    // Values in Crores (1Cr = 10,000,000)
    const arOutstandingCr = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0) / 10000000;
    const apOutstandingCr = bills.reduce((sum, bill) => sum + bill.totalAmount, 0) / 10000000;
    const bankBalanceCr = bankAccounts.reduce((sum, bank) => sum + bank.balance, 0) / 10000000;

    return {
      cashflowDays: 45,
      vendorDuesCr: apOutstandingCr,
      gstLiabilityCr: apOutstandingCr * 0.18,
      bankBalanceCr,
      revenueThisMonthCr: 0,
      arOutstandingCr,
      apOutstandingCr,
      updatedAt: new Date()
    };
  }

  // Invoices (AR)
  async findAllInvoices(tenantId: string) {
    return this.prisma.invoice.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async createInvoice(tenantId: string, data: any) {
    return this.prisma.invoice.create({ data: { ...data, tenantId } });
  }

  // Bills (AP)
  async findAllBills(tenantId: string) {
    return this.prisma.bill.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async createBill(tenantId: string, data: any) {
    return this.prisma.bill.create({ data: { ...data, tenantId } });
  }

  // Payments
  async recordPayment(tenantId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.paymentTransaction.create({ data: { ...data, tenantId } });
      
      // Update Invoice/Bill status if linked
      if (data.invoiceId) {
        await tx.invoice.update({ where: { id: data.invoiceId }, data: { status: 'Paid' } });
      }
      if (data.billId) {
        await tx.bill.update({ where: { id: data.billId }, data: { status: 'Paid' } });
      }

      return payment;
    });
  }

  // Ledger
  async getLedger(tenantId: string) {
    return this.prisma.ledgerEntry.findMany({ where: { tenantId }, orderBy: { date: 'desc' } });
  }

  async createLedgerEntry(tenantId: string, data: any) {
    return this.prisma.ledgerEntry.create({ data: { ...data, tenantId } });
  }
}
