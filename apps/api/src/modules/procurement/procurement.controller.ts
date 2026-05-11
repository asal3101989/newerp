import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { ProcurementService } from "./procurement.service";
import { VendorsService } from "./vendors.service";
import { MaterialRequisitionsService } from "./material-requisitions.service";
import { RfqService } from "./rfq.service";
import { GrnService } from "./grn.service";

@Controller("tenants/:tenantId/procurement")
@UseGuards(AuthGuard)
export class ProcurementController {
  constructor(
    private readonly procurement: ProcurementService,
    private readonly vendors: VendorsService,
    private readonly mrs: MaterialRequisitionsService,
    private readonly rfqs: RfqService,
    private readonly grns: GrnService
  ) {}
  
  @Get()
  async getSummary(@Param("tenantId") tenantId: string) {
    const [mrs, rfqs, pos] = await Promise.all([
      this.mrs.findAll(tenantId),
      this.rfqs.findAll(tenantId),
      this.procurement.findAllPos(tenantId)
    ]);
    
    return {
      counts: {
        mrPending: mrs.filter(m => m.status === "Pending").length,
        rfqActive: rfqs.filter(r => r.status === "Draft" || r.status === "Quoted").length,
        poApproval: pos.filter(p => p.status === "Draft" || p.status === "Review").length,
        total: mrs.length + rfqs.length + pos.length
      },
      // Fallback for summary list
      recentPos: pos.slice(0, 10).map(p => ({
        id: p.id,
        item: p.id.substring(0,8),
        vendorRecommendation: p.vendor?.name || "Unknown",
        nextAction: p.status,
        requiredQty: "PO"
      }))
    };
  }

  // Purchase Orders
  @Get("pos")
  findAllPos(@Param("tenantId") tenantId: string) {
    return this.procurement.findAllPos(tenantId);
  }

  @Post("pos")
  createPo(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.procurement.createPo(tenantId, data);
  }

  // Vendors
  @Get("vendors")
  findAllVendors(@Param("tenantId") tenantId: string) {
    return this.vendors.findAll(tenantId);
  }

  @Post("vendors")
  createVendor(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.vendors.create(tenantId, data);
  }

  // Material Requisitions
  @Get("mrs")
  findAllMrs(@Param("tenantId") tenantId: string) {
    return this.mrs.findAll(tenantId);
  }

  @Post("mrs")
  createMr(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.mrs.create(tenantId, data);
  }

  // RFQs
  @Get("rfqs")
  findAllRfqs(@Param("tenantId") tenantId: string) {
    return this.rfqs.findAll(tenantId);
  }

  @Post("rfqs")
  createRfq(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.rfqs.create(tenantId, data);
  }

  // GRNs
  @Get("grns")
  findAllGrns(@Param("tenantId") tenantId: string) {
    return this.grns.findAll(tenantId);
  }

  @Post("grns")
  createGrn(@Param("tenantId") tenantId: string, @Body() data: any) {
    return this.grns.create(tenantId, data);
  }
}
