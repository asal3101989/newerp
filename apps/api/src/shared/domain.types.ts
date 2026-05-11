export type RiskLevel = "low" | "medium" | "high";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "escalated";
export type WorkflowTrigger = "record.created" | "approval.pending" | "stock.low" | "invoice.ocr" | "dpr.submitted";

export type Tenant = {
  id: string;
  name: string;
  gstin: string;
  plan: "starter" | "professional" | "enterprise";
  branches: string[];
};

export type User = {
  id: string;
  tenantId: string;
  name: string;
  role: string;
  department: string;
  permissions: string[];
};

export type Project = {
  id: string;
  tenantId: string;
  name: string;
  city: string;
  type: "real-estate" | "infrastructure" | "epc" | "mep" | "interior";
  progress: number;
  budgetCr: number;
  risk: RiskLevel;
  status: string;
};

export type Approval = {
  id: string;
  tenantId: string;
  projectId: string;
  type: "PO" | "RA_BILL" | "EWAY_BILL" | "SAFETY_PERMIT" | "DPR";
  amountCr?: number;
  status: ApprovalStatus;
  currentApproverRole: string;
  slaHoursRemaining: number;
};

export type ProcurementItem = {
  id: string;
  tenantId: string;
  projectId: string;
  item: string;
  requiredQty: string;
  stockQty: string;
  vendorRecommendation: string;
  nextAction: "create-po" | "compare-rfq" | "approve-delivery" | "release-issue";
};

export type InventoryItem = {
  id: string;
  tenantId: string;
  warehouse: string;
  sku: string;
  material: string;
  onHand: string;
  reorderPoint: string;
  status: "ok" | "low" | "blocked";
};

export type FinanceSummary = {
  tenantId: string;
  cashflowDays: number;
  gstLiabilityCr: number;
  vendorDuesCr: number;
  arOutstandingCr: number;
  ocrAccuracy: number;
};

export type DocumentRecord = {
  id: string;
  tenantId: string;
  projectId: string;
  name: string;
  type: "drawing" | "contract" | "invoice" | "test-report" | "permit";
  version: string;
  ocrStatus: "queued" | "processed" | "failed";
  approvalStatus: ApprovalStatus;
};

export type WorkflowRule = {
  id: string;
  tenantId: string;
  name: string;
  trigger: WorkflowTrigger;
  condition: string;
  actions: string[];
  enabled: boolean;
};

export type DomainEvent = {
  id: string;
  tenantId: string;
  type: string;
  entityId: string;
  message: string;
  createdAt: string;
};

export type AuditRecord = {
  id: string;
  tenantId: string;
  userId?: string;
  entity: string;
  entityId: string;
  action: string;
  before?: unknown;
  after?: unknown;
  ipAddress?: string;
  createdAt: string;
};
