import type { ErpModule, IconName, RoleDashboard, RoleName } from "./types";

export const navItems: Array<{ label: string; icon: IconName }> = [
  { label: "Executive cockpit", icon: "grid" },
  { label: "Organization and Admin", icon: "shield" },
  { label: "CRM and sales", icon: "users" },
  { label: "Tendering and estimation", icon: "file" },
  { label: "Projects", icon: "chart" },
  { label: "Procurement", icon: "briefcase" },
  { label: "Inventory", icon: "box" },
  { label: "Contractors", icon: "briefcase" },
  { label: "Labour management", icon: "users" },
  { label: "Plant and machinery", icon: "box" },
  { label: "QA/QC", icon: "shield" },
  { label: "Safety EHS", icon: "shield" },
  { label: "Finance and GST", icon: "file" },
  { label: "Payroll and HRMS", icon: "users" },
  { label: "Document management", icon: "file" },
  { label: "Customer portal", icon: "phone" },
  { label: "Asset and facility", icon: "box" },
  { label: "BI and analytics", icon: "chart" },
  { label: "Workflow engine", icon: "grid" },
  { label: "AI automation", icon: "grid" },
  { label: "Mobile apps", icon: "phone" }
];

export const modules: ErpModule[] = [
  { title: "Organization and Admin", body: "Multi-company, RBAC, SSO, audit logs, workflow builder, escalation routing.", category: "ai" },
  { title: "CRM and Lead Management", body: "WhatsApp leads, site visits, unit inventory, AI scoring, auto quotations.", category: "ai" },
  { title: "Tendering and Estimation", body: "BOQ, rate analysis, OCR tender import, AI cost and vendor comparison.", category: "ai" },
  { title: "Project Planning", body: "WBS, Gantt, DPR, dependencies, baselines, AI delay prediction.", category: "field" },
  { title: "Procurement", body: "MR, RFQ, vendor portal, PO, comparative statements, smart approvals.", category: "ai" },
  { title: "Inventory and Warehouse", body: "QR, RFID, gate pass, batch tracking, transfers, AI stock forecasting.", category: "field" },
  { title: "Contractor Management", body: "Work orders, MB, RA bills, retention, work certification, anomaly checks.", category: "finance" },
  { title: "Labour Management", body: "Biometric and geo attendance, shifts, wages, productivity analytics.", category: "field" },
  { title: "Plant and Machinery", body: "GPS, fuel tracking, utilization, service reminders, predictive maintenance.", category: "field" },
  { title: "QA/QC", body: "IRs, checklists, NCR, test reports, cube tracking, mobile inspections.", category: "field" },
  { title: "Safety EHS", body: "Permits, incidents, PPE, toolbox talks, risk alerts, compliance reminders.", category: "field" },
  { title: "Finance and Accounting", body: "GL, AP, AR, GST, TDS, e-invoice, e-way bill, AI cashflow.", category: "finance" },
  { title: "Payroll and HRMS", body: "PF, ESI, PT, payroll, leave, recruitment, automated onboarding.", category: "finance" },
  { title: "Document Management", body: "Drawings, OCR search, versioning, digital signatures, approvals.", category: "ai" },
  { title: "Customer Portal", body: "Booking status, payments, complaints, documents, WhatsApp updates.", category: "ai" },
  { title: "Asset and Facility", body: "Lifecycle, warranty, AMC, preventive and predictive maintenance.", category: "field" },
  { title: "BI and AI Analytics", body: "Profitability, cost overrun, resource utilization, drill-down dashboards.", category: "ai" },
  { title: "Workflow Automation", body: "No-code builder, SLA monitoring, triggers, conditional approvals.", category: "ai" },
  { title: "Mobile Applications", body: "Management, site engineer, labour, vendor, customer, offline-first.", category: "field" },
  { title: "Advanced AI Agents", body: "Chatbot, voice, OCR, forecasting, risk, procurement, reports.", category: "ai" }
];

export const roleDashboards: Record<RoleName, RoleDashboard> = {
  Executive: {
    kpis: [
      { label: "Revenue", value: "Rs 184.2 Cr", trend: "+12.6%" },
      { label: "Project health", value: "86%", trend: "+4 pts" },
      { label: "Delayed tasks", value: "128", trend: "-18%" },
      { label: "Cash runway", value: "94 days", trend: "+11 days" }
    ],
    widgets: ["Revenue by business unit", "Project portfolio health", "Cashflow forecast", "Pending approvals by SLA"]
  },
  Project: {
    kpis: [
      { label: "DPR completion", value: "91%", trend: "+8%" },
      { label: "Budget variance", value: "3.8%", trend: "-1.2%" },
      { label: "Open NCRs", value: "42", trend: "-9" },
      { label: "Safety incidents", value: "3", trend: "-2" }
    ],
    widgets: ["Baseline vs actual", "Milestone risk", "Site photo intelligence", "Resource utilization"]
  },
  Finance: {
    kpis: [
      { label: "GST liability", value: "Rs 6.8 Cr", trend: "Ready" },
      { label: "Vendor dues", value: "Rs 22.4 Cr", trend: "-7%" },
      { label: "AR outstanding", value: "Rs 41.1 Cr", trend: "-5%" },
      { label: "OCR accuracy", value: "97.2%", trend: "+2%" }
    ],
    widgets: ["Cashflow prediction", "GST and TDS status", "AP approval queue", "Bank reconciliation"]
  },
  Site: {
    kpis: [
      { label: "Labour present", value: "1,842", trend: "+96" },
      { label: "Materials issued", value: "418 MT", trend: "+6%" },
      { label: "DPR drafts", value: "27", trend: "Auto" },
      { label: "Geo photos", value: "312", trend: "+44" }
    ],
    widgets: ["Today at site", "Material consumption", "Labour productivity", "Quality checklist status"]
  },
  Vendor: {
    kpis: [
      { label: "Open RFQs", value: "18", trend: "+4" },
      { label: "PO value", value: "Rs 9.7 Cr", trend: "+16%" },
      { label: "Delivery SLA", value: "93%", trend: "+3%" },
      { label: "Invoices paid", value: "Rs 2.1 Cr", trend: "Today" }
    ],
    widgets: ["RFQ response tracker", "Delivery schedule", "Invoice status", "Compliance documents"]
  },
  Customer: {
    kpis: [
      { label: "Units booked", value: "624", trend: "+22" },
      { label: "Collection", value: "Rs 18.2 Cr", trend: "+9%" },
      { label: "Complaints open", value: "31", trend: "-11" },
      { label: "Updates sent", value: "8,420", trend: "Auto" }
    ],
    widgets: ["Booking funnel", "Payment tracker", "Construction updates", "Service requests"]
  }
};

export const approvals = [
  { title: "PO approval", detail: "TMT steel, Rs 1.42 Cr, routed to CFO" },
  { title: "RA bill", detail: "Shivam Contractors, MB verified" },
  { title: "E-way bill", detail: "Ready for GST portal push" },
  { title: "Safety permit", detail: "Night concrete pour, Tower A" }
];

export const liveProjects = [
  { name: "Skyline Heights - Tower B", city: "Pune", progress: 68, budget: "Rs 312 Cr", status: "Delay risk", risk: "High" },
  { name: "Metro Depot Package C7", city: "Bengaluru", progress: 54, budget: "Rs 842 Cr", status: "On track", risk: "Medium" },
  { name: "Riverfront Villas Phase 2", city: "Ahmedabad", progress: 81, budget: "Rs 126 Cr", status: "Billing due", risk: "Low" },
  { name: "Airport MEP Fit-out", city: "Hyderabad", progress: 43, budget: "Rs 219 Cr", status: "Material hold", risk: "High" }
];

export const siteOperations = [
  { label: "DPRs pending review", value: "18", meta: "6 auto-drafted from mobile photos" },
  { label: "Material requisitions", value: "42", meta: "11 can convert to RFQ today" },
  { label: "RA bills in queue", value: "Rs 8.6 Cr", meta: "MB verification complete for 73%" },
  { label: "Open NCR and snags", value: "137", meta: "AI grouped 22 duplicate issues" },
  { label: "Labour attendance", value: "91.4%", meta: "Face and geo match passed" },
  { label: "Equipment utilization", value: "76%", meta: "2 fuel anomalies flagged" }
];

export const procurementRows = [
  { item: "Fe 500D TMT steel", project: "Skyline Heights", required: "320 MT", stock: "74 MT", action: "Create PO" },
  { item: "M30 ready-mix concrete", project: "Metro Depot C7", required: "1,850 m3", stock: "Scheduled", action: "Approve delivery" },
  { item: "Copper cable 3.5C", project: "Airport MEP", required: "18 km", stock: "3.2 km", action: "RFQ compare" },
  { item: "Vitrified tiles", project: "Riverfront Villas", required: "42,000 sqft", stock: "18,400 sqft", action: "Release issue" }
];

export const fieldFeed = [
  { time: "09:15", title: "Tower B slab pour started", meta: "128 workers, pump P-04, cube test scheduled" },
  { time: "10:05", title: "Invoice OCR matched PO", meta: "ACC Cement, Rs 38.4 L, 99.1% confidence" },
  { time: "11:20", title: "Safety observation escalated", meta: "Missing lifeline at Level 18, assigned to EHS" },
  { time: "12:10", title: "DPR generated from mobile sync", meta: "42 photos, 8 voice notes, 3 material issues" }
];

export const integrations = [
  "GST APIs",
  "E-Invoice",
  "E-Way Bill",
  "Aadhaar",
  "PAN",
  "UPI",
  "Razorpay",
  "Tally",
  "WhatsApp",
  "Maps",
  "Microsoft 365",
  "Google Workspace",
  "RFID",
  "IoT",
  "Biometric"
];

export const reports = [
  "DPR",
  "Project profitability",
  "GST reports",
  "Labour productivity",
  "Inventory aging",
  "Vendor performance",
  "Delay analysis",
  "Equipment utilization",
  "PDF",
  "Excel",
  "Email automation"
];

export const aiInsights = [
  "Forecast says Tower B may slip 11 days unless shuttering crew capacity improves this week.",
  "AI found 3 vendor invoices with rate variance above approved PO tolerance.",
  "Concrete cube test reminders are scheduled automatically for tomorrow's pours.",
  "Cashflow model recommends delaying two non-critical purchase orders by 9 days."
];
