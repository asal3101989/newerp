import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { FinanceService } from "./finance.service";
import { RABillsService } from "./ra-bills.service";

@Controller("tenants/:tenantId/finance")
export class FinanceController {
  constructor(
    private readonly finance: FinanceService,
    private readonly raBills: RABillsService
  ) {}

  @Get("summary")
  getSummary(@Param("tenantId") tenantId: string) {
    return this.finance.getSummary(tenantId);
  }

  // Invoices
  @Get("invoices")
  findAllInvoices(@Param("tenantId") tenantId: string) {
    return this.finance.findAllInvoices(tenantId);
  }

  @Post("invoices")
  createInvoice(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.finance.createInvoice(tenantId, data);
  }

  // Bills
  @Get("bills")
  findAllBills(@Param("tenantId") tenantId: string) {
    return this.finance.findAllBills(tenantId);
  }

  @Post("bills")
  createBill(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.finance.createBill(tenantId, data);
  }

  // RA Bills
  @Get("ra-bills")
  findAllRABills(@Param("tenantId") tenantId: string) {
    return this.raBills.findAll(tenantId);
  }

  @Post("ra-bills")
  createRABill(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.raBills.create(tenantId, data);
  }

  // Subcontractors
  @Get("subcontractors")
  findAllSubcontractors(@Param("tenantId") tenantId: string) {
    return this.raBills.findAllSubcontractors(tenantId);
  }

  @Post("subcontractors")
  createSubcontractor(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.raBills.createSubcontractor(tenantId, data);
  }

  // Payments
  @Post("payments")
  recordPayment(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.finance.recordPayment(tenantId, data);
  }

  // Ledger
  @Get("ledger")
  getLedger(@Param("tenantId") tenantId: string) {
    return this.finance.getLedger(tenantId);
  }

  @Post("ledger")
  createLedgerEntry(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.finance.createLedgerEntry(tenantId, data);
  }
}
