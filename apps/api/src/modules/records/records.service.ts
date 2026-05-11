import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { randomUUID } from "crypto";

@Injectable()
export class RecordsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) {}

  async findAll(tenantId: string, module: string) {
    if (module === "admin-audit-logs") {
      const audits = await (this.prisma as any).auditEvent.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 200
      });
      return audits.map((a: any) => ({
        id: a.id,
        module: "admin-audit-logs",
        recordId: a.entityId ? a.entityId.substring(0, 8).toUpperCase() : a.id.substring(0, 8),
        primary: `${a.action} ${a.entity}`,
        secondary: a.entityId,
        value: new Date(a.createdAt).toLocaleString(),
        owner: a.userId || "System User",
        status: "Logged",
        tenantId: a.tenantId,
        createdAt: a.createdAt,
        updatedAt: a.createdAt
      }));
    }

    // Phase 1 Delegations
    if (module === "projects") {
      const projects = await this.prisma.project.findMany({ where: { tenantId }, orderBy: { updatedAt: 'desc' } });
      return projects.map(p => ({
        id: p.id,
        module,
        recordId: p.wbsCode || p.id.substring(0, 8).toUpperCase(),
        primary: p.name,
        secondary: p.city || p.location || "Multiple",
        value: `Rs ${p.contractValue.toLocaleString()}`,
        owner: p.clientName || "Direct",
        status: p.status,
        tenantId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }));
    }

    if (module === "procurement-purchase-orders") {
      const pos = await this.prisma.purchaseOrder.findMany({ where: { tenantId }, include: { vendor: true }, orderBy: { updatedAt: 'desc' } });
      return pos.map(p => ({
        id: p.id,
        module,
        recordId: p.poNumber,
        primary: `PO to ${p.vendor?.name || 'Vendor'}`,
        secondary: p.status,
        value: `Rs ${p.totalAmount.toLocaleString()}`,
        owner: p.vendor?.name || "System",
        status: p.status,
        tenantId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }));
    }

    if (module === "procurement-vendor-management" || module === "procurement-vendor-portal") {
      const vendors = await this.prisma.vendor.findMany({ where: { tenantId }, orderBy: { updatedAt: 'desc' } });
      return vendors.map(v => ({
        id: v.id,
        module,
        recordId: v.gstNo || v.id.substring(0, 8),
        primary: v.name,
        secondary: v.email || v.phone || "No Contact",
        value: v.status,
        owner: "Procurement",
        status: v.status,
        tenantId,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt
      }));
    }

    if (module === "inventory-stock" || module === "inventory-material-requests") {
      const items = await this.prisma.inventoryItem.findMany({ where: { tenantId }, include: { warehouse: true }, orderBy: { updatedAt: 'desc' } });
      return items.map(i => ({
        id: i.id,
        module,
        recordId: i.sku || i.id.substring(0, 8),
        primary: i.material,
        secondary: i.warehouse?.name || "Default Store",
        value: `${i.onHand} ${i.unit}`,
        owner: i.category || "General",
        status: i.status,
        tenantId,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      }));
    }

    if (module === "finance-general-ledger") {
      const ledger = await this.prisma.ledgerEntry.findMany({ where: { tenantId }, orderBy: { date: 'desc' } });
      return ledger.map(l => ({
        id: l.id,
        module,
        recordId: l.id.substring(0, 8),
        primary: l.accountName,
        secondary: l.description || "System Entry",
        value: l.debit > 0 ? `Dr Rs ${l.debit}` : `Cr Rs ${l.credit}`,
        owner: "Finance",
        status: "Posted",
        tenantId,
        createdAt: l.createdAt,
        updatedAt: l.createdAt
      }));
    }

    if (module === "procurement-material-requisition") {
      const mrs = await this.prisma.materialRequisition.findMany({ where: { tenantId }, orderBy: { updatedAt: 'desc' } });
      return mrs.map(m => ({
        id: m.id,
        module,
        recordId: m.mrNo,
        primary: `MR for Project ${m.projectId || 'N/A'}`,
        secondary: m.status,
        value: "Material Request",
        owner: m.requesterId,
        status: m.status,
        tenantId,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      }));
    }

    if (module === "procurement-rfq") {
      const rfqs = await this.prisma.rFQ.findMany({ where: { tenantId }, include: { vendor: true }, orderBy: { updatedAt: 'desc' } });
      return rfqs.map(r => ({
        id: r.id,
        module,
        recordId: r.rfqNo,
        primary: `RFQ to ${r.vendor?.name || 'Multiple Vendors'}`,
        secondary: r.status,
        value: "Quote Request",
        owner: "Procurement",
        status: r.status,
        tenantId,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }));
    }

    if (module === "inventory-grn") {
      const grns = await this.prisma.gRN.findMany({ where: { tenantId }, include: { po: true }, orderBy: { createdAt: 'desc' } });
      return grns.map(g => ({
        id: g.id,
        module,
        recordId: g.grnNo,
        primary: `GRN for ${g.po.poNumber}`,
        secondary: g.status,
        value: "Material Receipt",
        owner: "Warehouse",
        status: g.status,
        tenantId,
        createdAt: g.createdAt,
        updatedAt: g.createdAt
      }));
    }

    if (module === "finance-accounts-receivable") {
      const invoices = await this.prisma.invoice.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
      return invoices.map(i => ({
        id: i.id,
        module,
        recordId: i.invoiceNo,
        primary: i.clientName,
        secondary: i.status,
        value: `Rs ${i.totalAmount.toLocaleString()}`,
        owner: "Finance",
        status: i.status,
        tenantId,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      }));
    }

    if (module === "finance-accounts-payable") {
      const bills = await this.prisma.bill.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
      return bills.map(b => ({
        id: b.id,
        module,
        recordId: b.billNo,
        primary: b.vendorName,
        secondary: b.status,
        value: `Rs ${b.totalAmount.toLocaleString()}`,
        owner: "Finance",
        status: b.status,
        tenantId,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      }));
    }

    if (module === "admin-branches") {
      const branches = await (this.prisma as any).branch.findMany({ where: { tenantId } });
      return branches.map((b: any) => ({
        id: b.id,
        module,
        recordId: b.id.substring(0, 8),
        primary: b.name,
        secondary: b.city || "Head Office",
        value: "Active",
        owner: "Admin",
        status: "Active",
        tenantId,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      }));
    }

    if (module === "admin-departments") {
      const depts = await (this.prisma as any).department.findMany({ where: { tenantId } });
      return depts.map((d: any) => ({
        id: d.id,
        module,
        recordId: d.id.substring(0, 8),
        primary: d.name,
        secondary: d.id,
        value: "Active",
        owner: "HR",
        status: "Active",
        tenantId,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      }));
    }

    if (module === "admin-roles") {
      const roles = await (this.prisma as any).role.findMany({ where: { tenantId } });
      return roles.map((r: any) => ({
        id: r.id,
        module,
        recordId: r.id.substring(0, 8),
        primary: r.name,
        secondary: r.description || "System Role",
        value: "Active",
        owner: "Admin",
        status: "Active",
        tenantId,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }));
    }

    return (this.prisma as any).genericRecord.findMany({
      where: { tenantId, module },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(
    tenantId: string,
    module: string,
    data: {
      recordId: string;
      primary: string;
      secondary?: string;
      value?: string;
      owner?: string;
      status?: string;
    }
  ) {
    // Phase 1 Creation Delegations
    if (module === "projects") {
      return this.prisma.project.create({
        data: {
          name: data.primary,
          city: data.secondary,
          clientName: data.owner,
          status: data.status || "Live",
          tenantId
        }
      });
    }

    if (module === "procurement-vendor-management") {
      return this.prisma.vendor.create({
        data: {
          name: data.primary,
          email: data.secondary,
          status: data.status || "Active",
          tenantId
        }
      });
    }

    if (module === "procurement-material-requisition") {
      return (this.prisma as any).materialRequisition.create({
        data: {
          mrNo: data.recordId,
          projectId: data.secondary,
          requesterId: data.owner || "System",
          items: "[]",
          status: data.status || "Pending",
          tenantId
        }
      });
    }

    if (module === "finance-accounts-receivable") {
      return (this.prisma as any).invoice.create({
        data: {
          invoiceNo: data.recordId,
          clientName: data.primary,
          amount: parseFloat((data.value || "0").replace(/[^0-9.]/g, "")) || 0,
          totalAmount: parseFloat((data.value || "0").replace(/[^0-9.]/g, "")) || 0,
          dueDate: new Date(),
          status: data.status || "Draft",
          tenantId
        }
      });
    }

    const result = await (this.prisma as any).genericRecord.create({
      data: {
        module,
        tenantId,
        recordId: data.recordId,
        primary: data.primary,
        secondary: data.secondary ?? "",
        value: data.value ?? "",
        owner: data.owner ?? "",
        status: data.status ?? "Active",
      },
    });

    await (this.prisma as any).auditEvent.create({
      data: {
        id: randomUUID(),
        tenantId,
        entity: `GenericRecord:${module}`,
        action: "CREATE",
        entityId: result.id,
        after: data ? JSON.parse(JSON.stringify(data)) : undefined
      }
    });
    return result;
  }

  async update(
    tenantId: string,
    module: string,
    id: string,
    data: Partial<{
      recordId: string;
      primary: string;
      secondary: string;
      value: string;
      owner: string;
      status: string;
    }>
  ) {
    // Phase 1 Update Delegations
    if (module === "projects") {
      return this.prisma.project.update({
        where: { id },
        data: {
          name: data.primary,
          city: data.secondary,
          clientName: data.owner,
          status: data.status,
          progress: data.value ? parseInt(data.value.replace(/[^0-9]/g, "")) : undefined
        }
      });
    }

    if (module === "finance-accounts-receivable") {
      return (this.prisma as any).invoice.update({
        where: { id, tenantId },
        data: {
          clientName: data.primary,
          status: data.status
        }
      });
    }

    const result = await (this.prisma as any).genericRecord.update({
      where: { id },
      data,
    });

    await (this.prisma as any).auditEvent.create({
      data: {
        id: randomUUID(),
        tenantId,
        entity: `GenericRecord:${module}`,
        action: "UPDATE",
        entityId: id,
        after: data ? JSON.parse(JSON.stringify(data)) : undefined
      }
    });
    return result;
  }

  async remove(tenantId: string, module: string, id: string) {
    // Phase 1 Delete Delegations
    if (module === "projects") {
      return this.prisma.project.delete({ where: { id, tenantId } });
    }

    const result = await (this.prisma as any).genericRecord.delete({
      where: { id },
    });

    await (this.prisma as any).auditEvent.create({
      data: {
        id: randomUUID(),
        tenantId,
        entity: `GenericRecord:${module}`,
        action: "DELETE",
        entityId: id
      }
    });
    return result;
  }
}
