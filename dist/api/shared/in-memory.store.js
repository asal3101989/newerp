"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStore = void 0;
const common_1 = require("@nestjs/common");
let InMemoryStore = class InMemoryStore {
    constructor() {
        this.tenants = [
            {
                id: "tenant-nirmaan",
                name: "Nirmaan Infra Projects Pvt Ltd",
                gstin: "27AABCN0000A1Z5",
                plan: "enterprise",
                branches: ["Pune", "Bengaluru", "Ahmedabad", "Hyderabad"]
            }
        ];
        this.users = [
            {
                id: "usr-cfo",
                tenantId: "tenant-nirmaan",
                name: "Ananya Rao",
                role: "CFO",
                department: "Finance",
                permissions: ["finance.approve", "po.approve", "gst.view"]
            },
            {
                id: "usr-pm",
                tenantId: "tenant-nirmaan",
                name: "Rohit Iyer",
                role: "Project Manager",
                department: "Projects",
                permissions: ["dpr.approve", "project.view", "ra_bill.verify"]
            }
        ];
        this.projects = [
            { id: "prj-skyline", tenantId: "tenant-nirmaan", name: "Skyline Heights - Tower B", city: "Pune", type: "real-estate", progress: 68, budgetCr: 312, risk: "high", status: "Delay risk" },
            { id: "prj-metro", tenantId: "tenant-nirmaan", name: "Metro Depot Package C7", city: "Bengaluru", type: "infrastructure", progress: 54, budgetCr: 842, risk: "medium", status: "On track" },
            { id: "prj-villas", tenantId: "tenant-nirmaan", name: "Riverfront Villas Phase 2", city: "Ahmedabad", type: "real-estate", progress: 81, budgetCr: 126, risk: "low", status: "Billing due" },
            { id: "prj-airport", tenantId: "tenant-nirmaan", name: "Airport MEP Fit-out", city: "Hyderabad", type: "mep", progress: 43, budgetCr: 219, risk: "high", status: "Material hold" }
        ];
        this.approvals = [
            { id: "apr-po-steel", tenantId: "tenant-nirmaan", projectId: "prj-skyline", type: "PO", amountCr: 1.42, status: "pending", currentApproverRole: "CFO", slaHoursRemaining: 6 },
            { id: "apr-ra-shivam", tenantId: "tenant-nirmaan", projectId: "prj-villas", type: "RA_BILL", amountCr: 0.86, status: "pending", currentApproverRole: "Project Manager", slaHoursRemaining: 11 },
            { id: "apr-eway", tenantId: "tenant-nirmaan", projectId: "prj-metro", type: "EWAY_BILL", status: "pending", currentApproverRole: "Finance Controller", slaHoursRemaining: 4 }
        ];
        this.procurement = [
            { id: "mat-tmt", tenantId: "tenant-nirmaan", projectId: "prj-skyline", item: "Fe 500D TMT steel", requiredQty: "320 MT", stockQty: "74 MT", vendorRecommendation: "JSW Steel - best landed rate", nextAction: "create-po" },
            { id: "mat-rmc", tenantId: "tenant-nirmaan", projectId: "prj-metro", item: "M30 ready-mix concrete", requiredQty: "1,850 m3", stockQty: "Scheduled", vendorRecommendation: "ACC RMC - SLA 96%", nextAction: "approve-delivery" },
            { id: "mat-cable", tenantId: "tenant-nirmaan", projectId: "prj-airport", item: "Copper cable 3.5C", requiredQty: "18 km", stockQty: "3.2 km", vendorRecommendation: "Polycab distributor quote pending", nextAction: "compare-rfq" }
        ];
        this.inventory = [
            { id: "inv-tmt", tenantId: "tenant-nirmaan", warehouse: "Pune Central Store", sku: "STL-TMT-500D", material: "Fe 500D TMT steel", onHand: "74 MT", reorderPoint: "120 MT", status: "low" },
            { id: "inv-cement", tenantId: "tenant-nirmaan", warehouse: "Bengaluru Depot Store", sku: "CEM-OPC-53", material: "OPC 53 cement", onHand: "3,420 bags", reorderPoint: "2,000 bags", status: "ok" },
            { id: "inv-cable", tenantId: "tenant-nirmaan", warehouse: "Hyderabad MEP Store", sku: "CBL-CU-3.5C", material: "Copper cable 3.5C", onHand: "3.2 km", reorderPoint: "8 km", status: "low" }
        ];
        this.finance = [
            { tenantId: "tenant-nirmaan", cashflowDays: 94, gstLiabilityCr: 6.8, vendorDuesCr: 22.4, arOutstandingCr: 41.1, ocrAccuracy: 97.2 }
        ];
        this.documents = [
            { id: "doc-dwg-1201", tenantId: "tenant-nirmaan", projectId: "prj-skyline", name: "Tower B structural slab revision", type: "drawing", version: "R4", ocrStatus: "processed", approvalStatus: "approved" },
            { id: "doc-inv-acc", tenantId: "tenant-nirmaan", projectId: "prj-metro", name: "ACC Cement invoice May batch", type: "invoice", version: "1", ocrStatus: "processed", approvalStatus: "pending" }
        ];
        this.workflows = [
            {
                id: "wf-stock-po",
                tenantId: "tenant-nirmaan",
                name: "Auto PO when stock drops below reorder point",
                trigger: "stock.low",
                condition: "inventory.status == low && approved_vendor.exists",
                actions: ["create_draft_po", "route_to_procurement_head", "notify_project_manager"],
                enabled: true
            },
            {
                id: "wf-invoice-ocr",
                tenantId: "tenant-nirmaan",
                name: "OCR invoice to AP approval",
                trigger: "invoice.ocr",
                condition: "ocr.confidence >= 95 && po.match == true",
                actions: ["create_ap_voucher", "route_to_finance", "update_vendor_ledger"],
                enabled: true
            }
        ];
        this.events = [];
        this.audit = [];
    }
    emit(event) {
        const saved = {
            ...event,
            id: `evt-${this.events.length + 1}`,
            createdAt: new Date().toISOString()
        };
        this.events.unshift(saved);
        return saved;
    }
    auditLog(record) {
        const saved = {
            ...record,
            id: `aud-${this.audit.length + 1}`,
            createdAt: new Date().toISOString()
        };
        this.audit.unshift(saved);
        return saved;
    }
};
exports.InMemoryStore = InMemoryStore;
exports.InMemoryStore = InMemoryStore = __decorate([
    (0, common_1.Injectable)()
], InMemoryStore);
