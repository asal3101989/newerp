"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart, DonutChart, TimelineChart } from "@/components/charts";
import { Icon } from "@/components/Icons";
import {
  aiInsights,
  approvals,
  fieldFeed,
  integrations,
  liveProjects,
  modules,
  navItems,
  procurementRows,
  reports,
  roleDashboards,
  siteOperations
} from "@/lib/platform-data";
import type { ModuleCategory, RoleName } from "@/lib/types";

const roles = Object.keys(roleDashboards) as RoleName[];
const filters: Array<"all" | ModuleCategory> = ["all", "ai", "field", "finance"];
type WorkspaceConfig = {
  title: string;
  subtitle: string;
  stats: [string, string][];
  columns: string[];
  rows: string[][];
};

function workspace(title: string, subtitle: string, stats: [string, string][], rows: string[][]): WorkspaceConfig {
  return {
    title,
    subtitle,
    stats,
    columns: ["Record", "Owner", "Status", "Next action"],
    rows
  };
}

const moduleWorkspaces = {
  "Executive cockpit": {
    title: "Executive cockpit",
    subtitle: "Company-wide control over projects, approvals, cashflow, procurement, labour, and compliance.",
    stats: [["Active projects", "64"], ["Pending approvals", "32"], ["High risk sites", "8"], ["Cash runway", "94 days"]],
    columns: ["Project", "Progress", "Risk", "Next action"],
    rows: liveProjects.map((project) => [project.name, `${project.progress}%`, project.risk, project.status])
  },
  "CRM and sales": {
    title: "CRM and sales",
    subtitle: "Lead capture, channel partners, site visits, bookings, quotations, and WhatsApp follow-ups.",
    stats: [["New leads", "248"], ["Site visits", "71"], ["Bookings", "18"], ["AI hot leads", "42"]],
    columns: ["Lead", "Source", "Unit", "Next action"],
    rows: [
      ["Amit Shah", "WhatsApp", "Tower B - 1204", "Send auto quotation"],
      ["Kavya Developers", "Channel partner", "Bulk inventory", "Schedule site visit"],
      ["Priya Menon", "Google Ads", "Villa 18", "AI follow-up due"]
    ]
  },
  "Organization and Admin": workspace(
    "Organization and Admin",
    "Companies, branches, roles, permissions, approval hierarchy, audit logs, SSO, and notification rules.",
    [["Companies", "4"], ["Branches", "18"], ["Roles", "26"], ["Audit events", "1,284"]],
    [["RBAC matrix", "Admin", "Active", "Review permissions"], ["Approval hierarchy", "COO", "Draft", "Publish flow"], ["SSO setup", "IT", "Ready", "Enable SAML"]]
  ),
  "Tendering and estimation": workspace(
    "Tendering and estimation",
    "BOQ preparation, rate analysis, vendor quotes, bid comparison, drawing quantity extraction, and AI cost estimate.",
    [["Active tenders", "12"], ["BOQs", "28"], ["Vendor quotes", "64"], ["AI variance", "3.8%"]],
    [["Metro package bid", "Estimation", "In review", "Compare rates"], ["Airport MEP BOQ", "QS team", "Draft", "Run AI estimate"], ["Tender PDF OCR", "AI", "Processed", "Validate BOQ"]]
  ),
  Projects: {
    title: "Projects",
    subtitle: "WBS, DPR, milestone tracking, Gantt baseline, delay alerts, and site progress.",
    stats: [["DPR pending", "18"], ["Milestones delayed", "12"], ["Photos synced", "312"], ["AI delay alerts", "7"]],
    columns: ["WBS item", "Plan", "Actual", "Owner"],
    rows: [
      ["Tower B slab cycle", "72%", "64%", "Site engineer"],
      ["MEP first fix", "48%", "43%", "MEP contractor"],
      ["Podium waterproofing", "90%", "88%", "QA/QC"]
    ]
  },
  Procurement: {
    title: "Procurement",
    subtitle: "MR, RFQ, comparative statements, vendor recommendation, PO approvals, and delivery schedules.",
    stats: [["Open MRs", "42"], ["RFQs live", "18"], ["Draft POs", "11"], ["Savings found", "Rs 38.2 L"]],
    columns: ["Material", "Project", "Required", "Action"],
    rows: procurementRows.map((row) => [row.item, row.project, row.required, row.action])
  },
  Inventory: {
    title: "Inventory",
    subtitle: "Multi-warehouse stock, GRN, issue slips, QR movement, transfers, scrap, and reorder alerts.",
    stats: [["Warehouses", "14"], ["Low stock", "9"], ["GRNs today", "26"], ["QR scans", "1,842"]],
    columns: ["Material", "Warehouse", "Stock", "Status"],
    rows: [
      ["Fe 500D TMT steel", "Pune Central Store", "74 MT", "Low stock"],
      ["OPC 53 cement", "Bengaluru Depot Store", "3,420 bags", "OK"],
      ["Copper cable 3.5C", "Hyderabad MEP Store", "3.2 km", "Low stock"]
    ]
  },
  Contractors: workspace(
    "Contractors",
    "Work orders, measurement book, RA bills, labour billing, contractor ledger, retention, and work certification.",
    [["Work orders", "86"], ["MB pending", "17"], ["RA bills", "22"], ["Retention", "Rs 4.6 Cr"]],
    [["Shivam Contractors RA", "Billing", "MB verified", "Approve bill"], ["Facade WO", "Contracts", "In progress", "Certify work"], ["Labour billing", "Site admin", "Pending", "Verify attendance"]]
  ),
  "Labour management": workspace(
    "Labour management",
    "Worker onboarding, biometric attendance, geo punches, shifts, wages, overtime, and productivity tracking.",
    [["Workers", "4,812"], ["Present today", "91.4%"], ["OT hours", "326"], ["Exceptions", "28"]],
    [["Tower B crew", "Site HR", "Synced", "Review exceptions"], ["Aadhaar verification", "HR", "Pending", "Verify KYC"], ["Wage batch", "Payroll", "Ready", "Process payroll"]]
  ),
  "Plant and machinery": workspace(
    "Plant and machinery",
    "Equipment allocation, fuel, maintenance, breakdowns, spare parts, GPS, sensors, and utilization.",
    [["Equipment", "138"], ["Utilization", "76%"], ["Breakdowns", "5"], ["Fuel alerts", "2"]],
    [["Concrete pump P-04", "Plant head", "Allocated", "Check service"], ["Excavator EX-12", "Site plant", "Fuel anomaly", "Investigate"], ["DG set service", "Maintenance", "Due", "Create job card"]]
  ),
  "QA/QC": workspace(
    "QA/QC",
    "Inspection requests, checklists, NCRs, test reports, concrete cube tracking, and snag workflows.",
    [["Open IRs", "31"], ["NCRs", "42"], ["Cube tests", "28"], ["Snags", "137"]],
    [["Slab reinforcement IR", "QA engineer", "Open", "Inspect"], ["Concrete cube test", "Lab", "Scheduled", "Record result"], ["Snag cluster", "Finishing", "Grouped", "Assign rectification"]]
  ),
  "Safety EHS": workspace(
    "Safety EHS",
    "Safety permits, incident reporting, PPE tracking, toolbox talks, risk assessments, and compliance checklists.",
    [["Permits", "16"], ["Incidents", "3"], ["PPE gaps", "22"], ["Toolbox talks", "92%"]],
    [["Work at height permit", "EHS", "Approval needed", "Approve PTW"], ["Near miss report", "Safety officer", "Escalated", "Close CAPA"], ["PPE audit", "Site EHS", "Open", "Issue warning"]]
  ),
  "Finance and GST": {
    title: "Finance and GST",
    subtitle: "GL, AP, AR, bank reconciliation, GST, TDS, e-invoice, e-way bill, and payment approvals.",
    stats: [["GST liability", "Rs 6.8 Cr"], ["Vendor dues", "Rs 22.4 Cr"], ["AR outstanding", "Rs 41.1 Cr"], ["OCR accuracy", "97.2%"]],
    columns: ["Transaction", "Amount", "Compliance", "Action"],
    rows: [
      ["ACC Cement invoice", "Rs 38.4 L", "GST matched", "Route to AP"],
      ["Shivam RA bill", "Rs 86 L", "TDS pending", "Approve deduction"],
      ["E-way bill batch", "14 docs", "Ready", "Push to portal"]
    ]
  },
  "Payroll and HRMS": workspace(
    "Payroll and HRMS",
    "Employee database, attendance, leave, payroll, reimbursements, recruitment, assets, PF, ESI, PT, and onboarding.",
    [["Employees", "742"], ["Payroll batch", "Ready"], ["Leave requests", "18"], ["PF/ESI", "Compliant"]],
    [["May salary run", "HR payroll", "Ready", "Process"], ["Engineer onboarding", "HR", "In progress", "Issue assets"], ["Reimbursement batch", "Finance", "Pending", "Approve"]]
  ),
  "Document management": workspace(
    "Document management",
    "Drawing version control, contracts, OCR search, digital signatures, tags, approvals, and expiry reminders.",
    [["Documents", "18,420"], ["Drawings", "4,812"], ["OCR queue", "0"], ["Expiring", "9"]],
    [["Tower B drawing R4", "DMS", "Approved", "Publish"], ["Vendor contract", "Legal", "Signature due", "Send reminder"], ["Invoice OCR", "AI", "Processed", "Archive"]]
  ),
  "Customer portal": workspace(
    "Customer portal",
    "Booking status, payment tracking, construction updates, complaints, service requests, downloads, and chatbot.",
    [["Customers", "2,846"], ["Bookings", "624"], ["Open complaints", "31"], ["Updates sent", "8,420"]],
    [["Flat 1204 update", "CRM", "Ready", "Notify buyer"], ["Payment demand", "Finance", "Due", "Send reminder"], ["Complaint SR-91", "CRM", "Open", "Assign team"]]
  ),
  "Asset and facility": workspace(
    "Asset and facility",
    "Asset lifecycle, preventive maintenance, warranty, AMC, handover, facility requests, and renewal reminders.",
    [["Assets", "3,218"], ["AMC due", "14"], ["Warranty expiring", "22"], ["Requests", "48"]],
    [["HVAC AMC", "Facility", "Due", "Renew"], ["Lift warranty", "Asset team", "Expiring", "Notify OEM"], ["Clubhouse request", "Facility", "Open", "Assign vendor"]]
  ),
  "BI and analytics": workspace(
    "BI and analytics",
    "Executive dashboards, profitability, cashflow, resource utilization, delay analytics, and AI recommendations.",
    [["Dashboards", "18"], ["Cost overrun", "3 projects"], ["Profitability", "14.8%"], ["AI alerts", "27"]],
    [["Project profitability", "BI", "Live", "Drill down"], ["Cashflow forecast", "Finance", "Updated", "Review"], ["Delay analytics", "PMO", "High risk", "Open report"]]
  ),
  "Workflow engine": workspace(
    "Workflow engine",
    "No-code triggers, conditional approvals, SLA monitoring, escalation matrix, auto tasks, and vendor onboarding.",
    [["Workflows", "147"], ["SLA met", "98.4%"], ["Escalations", "11"], ["Auto tasks", "628"]],
    [["Stock to PO", "Procurement", "Enabled", "Simulate"], ["Invoice OCR to AP", "Finance", "Enabled", "Review"], ["DPR delay alert", "PMO", "Draft", "Publish"]]
  ),
  "AI automation": workspace(
    "AI automation",
    "Chatbot, voice commands, OCR, forecasting, schedule prediction, procurement optimization, risk, and reports.",
    [["AI agents", "12"], ["OCR accuracy", "97.2%"], ["Forecasts", "38"], ["Anomalies", "7"]],
    [["Project risk agent", "AI", "Running", "View insight"], ["Invoice OCR", "AI", "Live", "Open queue"], ["Procurement optimizer", "AI", "Ready", "Run recommendation"]]
  ),
  "Mobile apps": {
    title: "Mobile apps",
    subtitle: "Offline-first apps for management, site engineers, labour attendance, vendors, and customers.",
    stats: [["Offline DPRs", "27"], ["Geo punches", "1,842"], ["Vendor uploads", "36"], ["Customer updates", "8,420"]],
    columns: ["App", "Workflow", "Sync status", "Action"],
    rows: [
      ["Site engineer", "DPR, photos, voice notes", "Synced", "Open queue"],
      ["Labour attendance", "Face and geo punch", "Live", "Review exceptions"],
      ["Vendor portal", "RFQ and invoice upload", "12 pending", "Send reminder"]
    ]
  }
} as const;

const moduleTabs: Record<string, Record<string, string[][]>> = {
  "Organization and Admin": {
    Companies: [["Nirmaan Infra", "Active", "4 branches"], ["Nirmaan Realty", "Active", "8 branches"]],
    Branches: [["Pune HQ", "Maharashtra", "Active"], ["Bengaluru", "Karnataka", "Active"]],
    Roles: [["CFO", "90", "Finance approvals"], ["Project Manager", "70", "DPR and RA bills"]],
    Approvals: [["PO hierarchy", "Published", "3 levels"], ["RA bill hierarchy", "Draft", "2 levels"]],
    Audit: [["Login events", "1,284", "Traceable"], ["Workflow events", "628", "Traceable"]]
  },
  Projects: {
    Overview: [["Skyline Heights", "68%", "High risk"], ["Metro Depot C7", "54%", "On track"]],
    WBS: [["1.02", "Tower B slab cycle", "64% actual"], ["2.04", "MEP first fix", "43% actual"]],
    DPR: [["09 May", "1284 labour", "Auto draft ready"], ["08 May", "1196 labour", "Approved"]],
    Milestones: [["Podium waterproofing", "12 May", "At risk"], ["MEP shaft closure", "18 May", "On track"]],
    "Delay Tracker": [["Tower B shuttering", "11 days", "Crew shortage"], ["Copper cable pull", "5 days", "Material hold"]]
  },
  Procurement: {
    "Material Requests": [["MR-1042", "TMT steel", "Pending approval"], ["MR-1043", "Copper cable", "RFQ needed"]],
    RFQs: [["RFQ-778", "3 vendors", "Closes today"], ["RFQ-779", "5 vendors", "Open"]],
    Comparison: [["TMT steel", "JSW best rate", "Recommend PO"], ["Cable", "Polycab pending", "Wait"]],
    "Purchase Orders": [["DRAFT-PO", "TMT steel", "Created"], ["PO-4421", "RMC", "Approved"]],
    Deliveries: [["TMT steel", "12 May", "Scheduled"], ["RMC", "Today", "Gate pass ready"]]
  },
  "Tendering and estimation": {
    Tenders: [["Metro package", "Open", "Due 14 May"], ["Airport MEP", "In review", "Due 18 May"]],
    BOQ: [["Civil BOQ", "1,284 lines", "Imported"], ["MEP BOQ", "842 lines", "OCR draft"]],
    "Rate analysis": [["Concrete M30", "Rs 5,200/m3", "Reviewed"], ["TMT steel", "Market linked", "Updated"]],
    Quotes: [["JSW Steel", "Lowest", "Valid"], ["ACC RMC", "SLA best", "Valid"]],
    "Bid comparison": [["Metro package", "12.4% margin", "Submit"], ["Airport MEP", "9.8% margin", "Review"]]
  },
  "CRM and sales": {
    Leads: [["Amit Shah", "WhatsApp", "Hot"], ["Priya Menon", "Google Ads", "Follow-up"]],
    "Site visits": [["Amit Shah", "Tomorrow", "Tower B"], ["Kavya Developers", "Friday", "Bulk visit"]],
    Bookings: [["Unit 1204", "Token paid", "Agreement due"], ["Villa 18", "Negotiation", "Quote sent"]],
    Quotations: [["Q-8891", "Tower B", "Sent"], ["Q-8892", "Villa 18", "Draft"]],
    "Channel partners": [["Prime Realty", "Active", "18 leads"], ["Urban Homes", "Active", "11 leads"]]
  },
  Inventory: {
    Stock: [["TMT steel", "74 MT", "Low"], ["Cement", "3420 bags", "OK"]],
    GRN: [["GRN-9021", "ACC Cement", "Matched"], ["GRN-9022", "TMT steel", "QC pending"]],
    Issue: [["ISS-331", "Tower B", "Approved"], ["ISS-332", "MEP store", "Pending"]],
    Transfers: [["Pune to Ahmedabad", "Tiles", "In transit"], ["Depot to Airport", "Cable", "Planned"]],
    "QR Log": [["QR-8821", "Steel issued", "09:15"], ["QR-8822", "Cement received", "10:22"]]
  },
  Contractors: {
    "Work orders": [["WO-221", "Facade work", "In progress"], ["WO-222", "Blockwork", "Issued"]],
    "Measurement book": [["MB-881", "Tower B", "Verified"], ["MB-882", "Podium", "Pending"]],
    "RA bills": [["RA-441", "Rs 86 L", "Approval"], ["RA-442", "Rs 42 L", "Draft"]],
    Retention: [["Shivam Contractors", "Rs 18 L", "Held"], ["Metro Build", "Rs 32 L", "Held"]],
    Ledger: [["Shivam Contractors", "Rs 1.2 Cr", "Open"], ["Metro Build", "Rs 2.8 Cr", "Open"]]
  },
  "Labour management": {
    Onboarding: [["Worker batch 44", "128 workers", "KYC pending"], ["MEP crew", "42 workers", "Ready"]],
    Attendance: [["Tower B", "1,284 present", "91.4%"], ["Airport MEP", "326 present", "88%"]],
    Shifts: [["Day shift", "Active", "2,842 workers"], ["Night pour", "Scheduled", "128 workers"]],
    Wages: [["May batch", "Ready", "Process"], ["OT batch", "326 hours", "Review"]],
    Productivity: [["Shuttering crew", "Below plan", "Alert"], ["Steel fixing", "On plan", "OK"]]
  },
  "Plant and machinery": {
    Equipment: [["Pump P-04", "Allocated", "Tower B"], ["Excavator EX-12", "Fuel alert", "Airport"]],
    Fuel: [["EX-12", "Anomaly", "Investigate"], ["DG-07", "Normal", "OK"]],
    Maintenance: [["Pump P-04", "Due", "Create job"], ["Crane C-02", "Done", "Closed"]],
    Breakdowns: [["Mixer M-11", "Open", "Technician assigned"], ["DG-07", "Closed", "Resolved"]],
    Utilization: [["Tower crane", "82%", "Good"], ["Excavators", "61%", "Review"]]
  },
  "QA/QC": {
    Inspections: [["IR-882", "Slab reinforcement", "Open"], ["IR-883", "Waterproofing", "Passed"]],
    NCR: [["NCR-221", "Honeycombing", "High"], ["NCR-222", "Tile lippage", "Medium"]],
    "Test reports": [["Cube test", "M30", "Scheduled"], ["Soil test", "Depot", "Uploaded"]],
    Snags: [["Finishing snag", "22 grouped", "Assign"], ["MEP snag", "14 open", "Review"]],
    Checklists: [["Pre-pour", "92%", "Ready"], ["Handover", "68%", "In progress"]]
  },
  "Safety EHS": {
    Permits: [["PTW-331", "Work at height", "Approval"], ["PTW-332", "Hot work", "Open"]],
    Incidents: [["INC-91", "Near miss", "Escalated"], ["INC-92", "PPE violation", "Closed"]],
    PPE: [["Helmet audit", "94%", "Good"], ["Harness audit", "81%", "Action"]],
    "Toolbox talks": [["Tower B", "Done", "128 workers"], ["Airport MEP", "Pending", "Night shift"]],
    Compliance: [["EHS checklist", "88%", "Review"], ["Risk assessment", "Updated", "Approved"]]
  },
  "Finance and GST": {
    "AP Invoices": [["INV-ACC-92", "Rs 38.4 L", "OCR matched"], ["INV-JSW-21", "Rs 1.42 Cr", "PO linked"]],
    AR: [["Skyline customer batch", "Rs 4.8 Cr", "Due"], ["Villa milestone", "Rs 1.2 Cr", "Raised"]],
    GST: [["GSTR-2B", "Matched 94%", "Review"], ["E-invoice", "Connected", "Ready"]],
    TDS: [["Shivam RA bill", "1%", "Pending"], ["Consultant fee", "10%", "Deducted"]],
    Payments: [["JSW Steel", "Rs 1.42 Cr", "CFO approval"], ["ACC Cement", "Rs 38.4 L", "Scheduled"]]
  },
  "Payroll and HRMS": {
    Employees: [["Ananya Rao", "CFO", "Active"], ["Rohit Iyer", "PM", "Active"]],
    Leave: [["Rohit Iyer", "2 days", "Pending"], ["Site engineer", "1 day", "Approved"]],
    Payroll: [["May salary", "Ready", "742 employees"], ["OT wages", "Review", "326 hours"]],
    Recruitment: [["Site engineer", "Interview", "3 candidates"], ["QS manager", "Offer", "Pending"]],
    Compliance: [["PF", "Ready", "Generate"], ["ESI", "Ready", "Generate"]]
  },
  "Document management": {
    Drawings: [["Tower B R4", "Approved", "Published"], ["MEP shop drawing", "Review", "Pending"]],
    Contracts: [["Vendor MSA", "Signature due", "Reminder"], ["Subcontract", "Approved", "Stored"]],
    OCR: [["ACC invoice", "Processed", "99.1%"], ["Tender PDF", "Processed", "BOQ ready"]],
    Signatures: [["Vendor MSA", "Pending", "Send"], ["Work order", "Signed", "Archive"]],
    Versions: [["Structural drawing", "R4", "Current"], ["Architectural drawing", "R7", "Current"]]
  },
  "Customer portal": {
    Bookings: [["Unit 1204", "Booked", "Agreement due"], ["Villa 18", "Token paid", "Follow-up"]],
    Payments: [["Demand note", "Rs 4.8 L", "Due"], ["Milestone bill", "Paid", "Receipt"]],
    Updates: [["Tower B", "68%", "Sent"], ["Riverfront", "81%", "Sent"]],
    Complaints: [["SR-91", "Plumbing", "Open"], ["SR-92", "Paint touchup", "Assigned"]],
    Chatbot: [["Payment query", "Resolved", "AI"], ["Possession date", "Escalated", "CRM"]]
  },
  "Asset and facility": {
    Assets: [["Lift L-01", "Warranty", "Active"], ["HVAC H-12", "AMC", "Due"]],
    Maintenance: [["Clubhouse HVAC", "Preventive", "Scheduled"], ["Lift L-01", "Breakdown", "Open"]],
    Warranty: [["Lift L-01", "22 days", "Expiring"], ["Pump P-08", "180 days", "Active"]],
    AMC: [["HVAC", "Due", "Renew"], ["Fire system", "Active", "OK"]],
    Requests: [["Clubhouse AC", "Open", "Assign"], ["Lobby light", "Closed", "Done"]]
  },
  "BI and analytics": {
    Executive: [["Revenue", "Rs 184.2 Cr", "Up"], ["Project health", "86%", "Stable"]],
    Profitability: [["Skyline", "14.8%", "Good"], ["Airport MEP", "9.1%", "Review"]],
    Cashflow: [["Runway", "94 days", "Healthy"], ["Vendor dues", "Rs 22.4 Cr", "Watch"]],
    Delays: [["Tower B", "11 days", "High"], ["Cable pull", "5 days", "Medium"]],
    Forecasting: [["Cost overrun", "3 projects", "Alert"], ["Labour productivity", "Below plan", "Action"]]
  },
  "Workflow engine": {
    Builder: [["Stock to PO", "Enabled", "No-code"], ["Invoice OCR to AP", "Enabled", "No-code"]],
    Triggers: [["stock.low", "Active", "PO draft"], ["invoice.ocr", "Active", "AP voucher"]],
    Approvals: [["PO approval", "3 levels", "Published"], ["RA bill", "2 levels", "Draft"]],
    SLA: [["PO SLA", "98.4%", "Good"], ["Invoice SLA", "94.1%", "Review"]],
    Escalations: [["CFO escalation", "6 hrs", "Enabled"], ["PM escalation", "12 hrs", "Enabled"]]
  },
  "AI automation": {
    Agents: [["Risk agent", "Running", "Projects"], ["Procurement agent", "Ready", "PO optimization"]],
    OCR: [["Invoices", "97.2%", "Live"], ["Tender docs", "94.8%", "Live"]],
    Forecasting: [["Cashflow", "94 days", "Updated"], ["Schedule", "11 day risk", "Alert"]],
    Anomalies: [["Fuel", "2 alerts", "Investigate"], ["Billing", "3 alerts", "Review"]],
    Chatbot: [["ERP assistant", "Live", "Voice ready"], ["Customer bot", "Live", "WhatsApp"]]
  },
  "Mobile apps": {
    Management: [["Executive app", "Live", "Dashboards"], ["Approval app", "Live", "32 pending"]],
    "Site engineer": [["DPR", "27 drafts", "Offline"], ["Photos", "312 synced", "Live"]],
    Labour: [["Face punch", "1,842", "Synced"], ["Geo exceptions", "28", "Review"]],
    Vendor: [["RFQ response", "18 open", "Notify"], ["Invoice upload", "36 files", "OCR"]],
    Customer: [["Construction update", "8,420 sent", "Auto"], ["Complaints", "31 open", "Track"]]
  },
  "Quality and safety": {
    NCR: [["NCR-221", "Honeycombing", "High"], ["NCR-222", "Tile lippage", "Medium"]],
    Inspections: [["IR-882", "Slab reinforcement", "Open"], ["IR-883", "Waterproofing", "Passed"]],
    Permits: [["PTW-331", "Work at height", "EHS approval"], ["PTW-332", "Hot work", "Open"]],
    Incidents: [["INC-91", "Near miss", "Escalated"], ["INC-92", "PPE violation", "Closed"]],
    Compliance: [["Toolbox talk", "92%", "Good"], ["PPE audit", "81%", "Needs action"]]
  }
};

const defaultSubmenus = ["Records", "Approvals", "Automation"];

function getSubmenus(moduleLabel: string) {
  if (moduleLabel === "Executive cockpit") return [];
  const mapped = Object.keys(moduleTabs[moduleLabel] ?? {});
  return mapped.length ? mapped : defaultSubmenus;
}

export function DashboardShell({
  initialModule = "Executive cockpit",
  initialSubmenu = ""
}: {
  initialModule?: string;
  initialSubmenu?: string;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const safeInitialModule = initialModule in moduleWorkspaces ? (initialModule as keyof typeof moduleWorkspaces) : "Executive cockpit";
  const [activeModule, setActiveModule] = useState<keyof typeof moduleWorkspaces>(safeInitialModule);
  const [activeSubmenu, setActiveSubmenu] = useState(initialSubmenu || getSubmenus(safeInitialModule)[0] || "");
  const [role, setRole] = useState<RoleName>("Executive");
  const [filter, setFilter] = useState<"all" | ModuleCategory>("all");
  const [search, setSearch] = useState("");
  const [insightIndex, setInsightIndex] = useState(0);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [widgetOrder, setWidgetOrder] = useState(roleDashboards.Executive.widgets);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const applyHashRoute = () => {
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      if (pathParts[0] === "modules" && pathParts[1]) {
        const moduleFromPath = decodeURIComponent(pathParts[1]);
        const submenuFromPath = pathParts[2] ? decodeURIComponent(pathParts[2]) : "";
        if (moduleFromPath in moduleWorkspaces) {
          const submenus = getSubmenus(moduleFromPath);
          setActiveModule(moduleFromPath as keyof typeof moduleWorkspaces);
          setActiveSubmenu(submenus.includes(submenuFromPath) ? submenuFromPath : submenus[0] || "");
          return;
        }
      }

      const hash = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
      if (!hash) return;
      const [moduleFromHash, submenuFromHash] = hash.split("/");
      if (!moduleFromHash || !(moduleFromHash in moduleWorkspaces)) return;
      const submenus = getSubmenus(moduleFromHash);
      setActiveModule(moduleFromHash as keyof typeof moduleWorkspaces);
      setActiveSubmenu(submenus.includes(submenuFromHash) ? submenuFromHash : submenus[0]);
    };

    applyHashRoute();
    window.addEventListener("hashchange", applyHashRoute);
    return () => window.removeEventListener("hashchange", applyHashRoute);
  }, []);

  function openScreen(moduleLabel: keyof typeof moduleWorkspaces, submenu?: string) {
    const submenus = getSubmenus(moduleLabel);
    const nextSubmenu = submenu ?? submenus[0];
    if (nextSubmenu) {
      window.location.href = `/modules/${encodeURIComponent(moduleLabel)}/${encodeURIComponent(nextSubmenu)}`;
    } else {
      window.location.href = "/";
    }
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setInsightIndex((current) => (current + 1) % aiInsights.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setWidgetOrder(roleDashboards[role].widgets);
  }, [role]);

  const visibleModules = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return modules.filter((module) => {
      const filterMatch = filter === "all" || module.category === filter;
      const searchMatch = !normalized || `${module.title} ${module.body} ${module.category}`.toLowerCase().includes(normalized);
      return filterMatch && searchMatch;
    });
  }, [filter, search]);

  function moveWidget(target: string) {
    if (!draggedWidget || draggedWidget === target) return;

    setWidgetOrder((current) => {
      const next = [...current];
      const from = next.indexOf(draggedWidget);
      const to = next.indexOf(target);
      if (from < 0 || to < 0) return current;
      next.splice(from, 1);
      next.splice(to, 0, draggedWidget);
      return next;
    });
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark">NC</span>
          <span>
            <strong>NirmaanCloud</strong>
            <small>AI Construction ERP</small>
          </span>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const submenus = getSubmenus(item.label);
            const isActive = activeModule === item.label;

            return (
              <div className="nav-group" key={item.label}>
                <button
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => {
                    openScreen(item.label as keyof typeof moduleWorkspaces);
                  }}
                  type="button"
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </button>
                {isActive && submenus.length ? (
                  <div className="submenu-list">
                    {submenus.map((submenu) => (
                      <button
                        className={activeSubmenu === submenu ? "active" : ""}
                        key={submenu}
                        onClick={() => {
                          openScreen(item.label as keyof typeof moduleWorkspaces, submenu);
                          setSidebarOpen(false);
                        }}
                        type="button"
                      >
                        {submenu}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <span className="status-dot" />
          <div>
            <strong>Automation Health</strong>
            <small>147 live workflows, 98.4% SLA met</small>
          </div>
        </div>
      </aside>

      <main className={`workspace ${activeModule === "Executive cockpit" ? "cockpit-page" : "module-page"}`}>
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen((open) => !open)} type="button" aria-label="Toggle navigation">
            <span />
            <span />
            <span />
          </button>
          <div className="search-wrap">
            <Icon name="search" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects, vendors, bills, drawings, DPRs..."
            />
          </div>
          <div className="top-actions">
            <button className="ghost-button" type="button">Offline ready</button>
            <button className="icon-button" onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))} type="button" aria-label="Toggle dark mode">
              <Icon name="moon" />
            </button>
            <button className="primary-button" type="button">Create workflow</button>
          </div>
        </header>

        <section className="project-context-bar">
          <div>
            <span>Current project</span>
            <strong>Skyline Heights - Tower B</strong>
          </div>
          <div>
            <span>Package</span>
            <strong>Structure and MEP</strong>
          </div>
          <div>
            <span>Cost code</span>
            <strong>01.02.18</strong>
          </div>
          <div>
            <span>Site date</span>
            <strong>09 May 2026</strong>
          </div>
          <button className="primary-button" type="button">Open project command</button>
        </section>

        {activeModule !== "Executive cockpit" ? (
          <ModuleWorkspace
            activeSubmenu={activeSubmenu}
            key={`${activeModule}-${activeSubmenu}`}
            onSubmenuChange={(submenu) => openScreen(activeModule, submenu)}
            workspace={moduleWorkspaces[activeModule]}
          />
        ) : null}

        {activeModule === "Executive cockpit" ? <ExecutiveCockpit /> : null}

        <section className="zoho-workbench">
          <div className="suite-header">
            <div>
              <span className="eyebrow">NirmaanCloud ERP Home</span>
              <h1>Good morning, control today&apos;s site work, procurement, billing, labour, GST, and approvals.</h1>
            </div>
            <div className="company-card">
              <span>Active company</span>
              <strong>Nirmaan Infra Projects Pvt Ltd</strong>
              <small>FY 2026-27 | GSTIN 27AABCN0000A1Z5</small>
            </div>
          </div>

          <div className="app-shortcuts" aria-label="ERP app shortcuts">
            {[
              ["Projects", "DPR, WBS, Gantt", "blue"],
              ["Procure", "MR, RFQ, PO", "orange"],
              ["Stores", "GRN, issue, QR", "green"],
              ["Contractors", "MB, RA bill", "violet"],
              ["Finance", "GST, TDS, AP", "red"],
              ["Labour", "Attendance, wages", "cyan"],
              ["Quality", "NCR, tests", "yellow"],
              ["Documents", "Drawings, OCR", "slate"]
            ].map(([title, meta, color]) => (
              <button className={`app-tile ${color}`} key={title} type="button">
                <strong>{title}</strong>
                <small>{meta}</small>
              </button>
            ))}
          </div>

          <div className="suite-grid">
            <div className="panel today-panel">
              <div className="section-heading compact-heading">
                <h2>Today&apos;s ERP work</h2>
                <span className="count-badge">Live</span>
              </div>
              <div className="work-queue">
                {siteOperations.map((item) => (
                  <div className="queue-row" key={item.label}>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.meta}</small>
                    </span>
                    <b>{item.value}</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel project-snapshot">
              <div className="section-heading compact-heading">
                <h2>Skyline Heights - Tower B</h2>
                <span className="tag danger">Delay risk</span>
              </div>
              <div className="tower-scene light" aria-label="Construction site progress visual">
                <span className="crane mast" />
                <span className="crane jib" />
                <span className="tower tower-a" />
                <span className="tower tower-b" />
                <span className="tower tower-c" />
                <span className="hook" />
                <span className="ground" />
              </div>
              <div className="snapshot-metrics">
                <span><strong>68%</strong> progress</span>
                <span><strong>Rs 18.4 Cr</strong> certified</span>
                <span><strong>1,284</strong> labour</span>
              </div>
            </div>

            <div className="panel ai-card">
              <div className="brief-header">
                <span>AI assistant</span>
                <strong>Live</strong>
              </div>
              <p>{aiInsights[insightIndex]}</p>
              <div className="brief-grid">
                <span>DPR draft</span>
                <span>BOQ variance</span>
                <span>RA bill audit</span>
                <span>Material forecast</span>
              </div>
              <button className="primary-button full" type="button">Ask Nirmaan AI</button>
            </div>
          </div>
        </section>

        <section className="project-table panel">
          <div className="section-heading compact-heading">
            <h2>Live project portfolio</h2>
            <span className="count-badge">Real time</span>
          </div>
          <div className="erp-table">
            <div className="table-row table-head">
              <span>Project</span>
              <span>City</span>
              <span>Progress</span>
              <span>Budget</span>
              <span>Status</span>
            </div>
            {liveProjects.map((project) => (
              <div className="table-row" key={project.name}>
                <span>
                  <strong>{project.name}</strong>
                  <small>{project.risk} risk</small>
                </span>
                <span>{project.city}</span>
                <span>
                  <i className="progress-track"><b style={{ width: `${project.progress}%` }} /></i>
                  {project.progress}%
                </span>
                <span>{project.budget}</span>
                <span><em className={`status-chip ${project.risk.toLowerCase()}`}>{project.status}</em></span>
              </div>
            ))}
          </div>
        </section>

        <section className="role-strip" aria-label="Role dashboards">
          {roles.map((roleName) => (
            <button className={`role-pill ${role === roleName ? "active" : ""}`} key={roleName} onClick={() => setRole(roleName)} type="button">
              {roleName === "Site" ? "Site engineer" : roleName}
            </button>
          ))}
        </section>

        <section className="kpi-grid">
          {roleDashboards[role].kpis.map((kpi) => (
            <article className="kpi-card" key={kpi.label}>
              <header>
                <span>{kpi.label}</span>
                <span className="trend">{kpi.trend}</span>
              </header>
              <strong>{kpi.value}</strong>
              <small className="muted">Synced across ERP, mobile, and approval workflows</small>
            </article>
          ))}
        </section>

        <section className="dashboard-layout">
          <div className="widget-zone">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Drag and drop</span>
                <h2>{role} dashboard</h2>
              </div>
              <button className="secondary-button compact" type="button">Customize</button>
            </div>
            <div className="widget-grid">
              {widgetOrder.map((widget, index) => (
                <article
                  className={`widget-card ${draggedWidget === widget ? "dragging" : ""}`}
                  draggable
                  key={widget}
                  onDragStart={() => setDraggedWidget(widget)}
                  onDragEnd={() => setDraggedWidget(null)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    moveWidget(widget);
                  }}
                >
                  <div className="section-heading compact-heading">
                    <h2>{widget}</h2>
                    <span className="tag">AI</span>
                  </div>
                  {index % 3 === 0 ? <BarChart /> : index % 3 === 1 ? <DonutChart /> : <TimelineChart />}
                </article>
              ))}
            </div>
          </div>

          <aside className="right-rail">
            <div className="panel">
              <div className="section-heading compact-heading">
                <h2>Smart approvals</h2>
                <span className="count-badge">32</span>
              </div>
              <div className="stack-list">
                {approvals.map((approval) => (
                  <div className="approval-item" key={approval.title}>
                    <span>
                      <strong>{approval.title}</strong>
                      <small>{approval.detail}</small>
                    </span>
                    <button className="secondary-button compact" type="button">Approve</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="section-heading compact-heading">
                <h2>Workflow engine</h2>
                <span className="count-badge green">Auto</span>
              </div>
              <div className="workflow-map">
                {["MR", "RFQ", "PO", "GRN", "AP"].map((step, index, list) => (
                  <FragmentWithConnector key={step} showConnector={index < list.length - 1} step={step} />
                ))}
              </div>
              <p className="muted">Conditional approvals, SLA escalation, auto task creation, invoice OCR, and vendor onboarding.</p>
            </div>
          </aside>
        </section>

        <section className="operations-grid">
          <div className="panel wide">
            <div className="section-heading compact-heading">
              <h2>Procurement and material control</h2>
              <span className="count-badge green">Auto reorder</span>
            </div>
            <div className="erp-table procurement-table">
              <div className="table-row table-head">
                <span>Material</span>
                <span>Project</span>
                <span>Required</span>
                <span>Stock</span>
                <span>Action</span>
              </div>
              {procurementRows.map((row) => (
                <div className="table-row" key={row.item}>
                  <span><strong>{row.item}</strong></span>
                  <span>{row.project}</span>
                  <span>{row.required}</span>
                  <span>{row.stock}</span>
                  <span><button className="secondary-button compact" type="button">{row.action}</button></span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-heading compact-heading">
              <h2>Field feed</h2>
              <span className="count-badge">Mobile</span>
            </div>
            <div className="field-feed">
              {fieldFeed.map((item) => (
                <div className="feed-item" key={item.title}>
                  <time>{item.time}</time>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.meta}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="module-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Connected suite</span>
              <h2>Twenty integrated modules</h2>
            </div>
            <div className="segment-control" role="tablist" aria-label="Module filter">
              {filters.map((filterName) => (
                <button className={filter === filterName ? "active" : ""} key={filterName} onClick={() => setFilter(filterName)} type="button">
                  {filterName === "all" ? "All" : filterName[0].toUpperCase() + filterName.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="module-grid">
            {visibleModules.map((module, index) => (
              <article className="module-card" key={module.title}>
                <header>
                  <span className="module-icon">
                    <Icon name={(["grid", "chart", "briefcase", "shield"] as const)[index % 4]} />
                  </span>
                  <span className="tag">{module.category.toUpperCase()}</span>
                </header>
                <h3>{module.title}</h3>
                <p>{module.body}</p>
                <span className="tag">Automated workflow</span>
              </article>
            ))}
          </div>
        </section>

        <section className="operations-grid">
          <div className="panel wide">
            <div className="section-heading compact-heading">
              <h2>Indian compliance and integrations</h2>
              <span className="count-badge">Live APIs</span>
            </div>
            <div className="integration-grid">
              {integrations.map((integration) => (
                <div className="integration-tile" key={integration}>{integration}</div>
              ))}
            </div>
          </div>
          <div className="panel mobile-preview">
            <div className="phone-shell">
              <div className="phone-top" />
              <div className="phone-screen">
                <span className="eyebrow">Site engineer app</span>
                <h3>DPR auto-draft</h3>
                <div className="phone-card">Geo-tagged attendance synced</div>
                <div className="phone-card">12 photos added to Tower C</div>
                <div className="phone-card">Voice note converted to NCR</div>
                <button className="primary-button full" type="button">Submit DPR</button>
              </div>
            </div>
          </div>
        </section>

        <section className="report-band">
          <div>
            <span className="eyebrow">Reports</span>
            <h2>Board-ready reports, generated automatically.</h2>
          </div>
          <div className="report-chips">
            {reports.map((report) => (
              <span key={report}>{report}</span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FragmentWithConnector({ showConnector, step }: { showConnector: boolean; step: string }) {
  return (
    <>
      <span>{step}</span>
      {showConnector ? <i /> : null}
    </>
  );
}

function ExecutiveCockpit() {
  return (
    <section className="executive-only">
      <div className="exec-header">
        <div>
          <span className="eyebrow">Executive cockpit</span>
          <h1>Nirmaan Infra command view for projects, cashflow, approvals, materials, labour, and risk.</h1>
        </div>
        <div className="exec-company">
          <span>Active company</span>
          <strong>Nirmaan Infra Projects Pvt Ltd</strong>
          <small>64 projects | 18 branches | GST ready</small>
        </div>
      </div>

      <div className="exec-kpis">
        {[
          ["Revenue", "Rs 184.2 Cr", "+12.6%"],
          ["Project health", "86%", "8 high-risk sites"],
          ["Cash runway", "94 days", "Healthy"],
          ["Pending approvals", "32", "SLA tracked"],
          ["Labour productivity", "91.4%", "Today"],
          ["Material risk", "9 items", "Low stock"]
        ].map(([label, value, meta]) => (
          <article className="exec-kpi" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{meta}</small>
          </article>
        ))}
      </div>

      <div className="exec-grid">
        <div className="panel exec-panel">
          <div className="section-heading compact-heading">
            <h2>Project control tower</h2>
            <span className="count-badge">Live</span>
          </div>
          <div className="exec-project-list">
            {liveProjects.map((project) => (
              <div className="exec-project" key={project.name}>
                <span>
                  <strong>{project.name}</strong>
                  <small>{project.city} | {project.status}</small>
                </span>
                <i className="progress-track"><b style={{ width: `${project.progress}%` }} /></i>
                <em className={`status-chip ${project.risk.toLowerCase()}`}>{project.risk}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="panel exec-panel">
          <div className="section-heading compact-heading">
            <h2>Approval cockpit</h2>
            <span className="count-badge">32</span>
          </div>
          <div className="stack-list">
            {approvals.map((approval) => (
              <div className="approval-item" key={approval.title}>
                <span>
                  <strong>{approval.title}</strong>
                  <small>{approval.detail}</small>
                </span>
                <button className="secondary-button compact" type="button">Approve</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="exec-grid three">
        <div className="panel">
          <h2>Cashflow forecast</h2>
          <div className="donut"><span>94d</span></div>
          <p className="muted">AI predicts healthy runway, with vendor dues watch on Airport MEP and Skyline Tower B.</p>
        </div>
        <div className="panel">
          <h2>Material control</h2>
          <div className="field-feed">
            {procurementRows.slice(0, 3).map((row) => (
              <div className="feed-item" key={row.item}>
                <time>{row.stock}</time>
                <span><strong>{row.item}</strong><small>{row.project} | {row.action}</small></span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>AI executive brief</h2>
          <p className="exec-brief">Tower B may slip 11 days unless shuttering crew capacity improves this week. Two low-stock items can be converted into draft POs today.</p>
          <button className="primary-button full" type="button">Generate board report</button>
        </div>
      </div>
    </section>
  );
}

function ModuleWorkspace({
  activeSubmenu,
  onSubmenuChange,
  workspace
}: {
  activeSubmenu: string;
  onSubmenuChange: (submenu: string) => void;
  workspace: {
    title: string;
    subtitle: string;
    stats: readonly (readonly [string, string])[];
    columns: readonly string[];
    rows: readonly (readonly string[])[];
  };
}) {
  const [records, setRecords] = useState(() => workspace.rows.map((row) => [...row]));
  const [activity, setActivity] = useState<string[]>([`Opened ${workspace.title} workspace`]);
  const [isWorking, setIsWorking] = useState(false);
  const tabs = moduleTabs[workspace.title] ?? {
    Records: workspace.rows.map((row) => [...row.slice(0, 3)]),
    Approvals: [["Pending", "Digital approval", "Ready"], ["Audit", "Trace enabled", "Active"]],
    Automation: [["Workflow", "Auto route", "Enabled"], ["AI", "Recommendation", "Ready"]]
  };
  const tabNames = Object.keys(tabs);
  const activeTab = tabs[activeSubmenu] ? activeSubmenu : tabNames[0];
  const projectScreen = workspace.title === "Projects" ? getProjectScreen(activeTab) : null;

  useEffect(() => {
    setRecords(workspace.rows.map((row) => [...row]));
    setActivity([`Opened ${workspace.title} workspace`]);
  }, [workspace]);

  function recordActivity(message: string, action = "ui.action") {
    setActivity((current) => [message, ...current]);
    fetch("http://127.0.0.1:7001/api/v1/tenants/tenant-nirmaan/module-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module: workspace.title,
        submenu: activeTab,
        action,
        message
      })
    }).catch(() => {
      setActivity((current) => ["API audit sync pending", ...current]);
    });
  }

  async function runRecordAction(index: number) {
    const record = records[index];
    const label = record[0] ?? "record";
    setIsWorking(true);

    try {
      if (workspace.title === "Procurement" && index === 0) {
        const response = await fetch("http://127.0.0.1:7001/api/v1/tenants/tenant-nirmaan/procurement/mat-tmt/draft-po", {
          method: "POST"
        });
        const payload = (await response.json()) as { poNumber?: string };
        recordActivity(`Draft PO created: ${payload.poNumber ?? "created"} for ${label}`, "procurement.po.created");
      } else {
        recordActivity(`Processed ${label} in ${workspace.title}`, "record.processed");
      }

      setRecords((current) =>
        current.map((row, rowIndex) => {
          if (rowIndex !== index) return row;
          const next = [...row];
          next[next.length - 1] = workspace.title === "Approvals" ? "Approved" : "Processed";
          return next;
        })
      );
    } catch {
      setActivity((current) => [`Action failed for ${label}. API may be offline.`, ...current]);
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <section className="module-workspace panel">
      <div className="premium-module-header">
        <div>
          <div className="screen-route-bar">
            <span>Construction ERP</span>
            <b>{workspace.title}</b>
            <b>{activeTab}</b>
          </div>
          <h2>{activeTab}</h2>
          <p>{projectScreen?.subtitle ?? workspace.subtitle}</p>
        </div>
        <div className="module-actions">
          <button className="secondary-button" type="button">Attachments</button>
          <button className="secondary-button" type="button">Audit trail</button>
          <button className="primary-button" type="button">Create transaction</button>
        </div>
      </div>

      <div className="submenu-page-title">
        <span>{workspace.title}</span>
        <strong>{activeTab}</strong>
      </div>

      <div className="module-stat-grid">
        {(projectScreen?.stats ?? workspace.stats).map(([label, value]) => (
          <div className="module-stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <ConstructionErpCanvas activeSubmenu={activeTab} moduleTitle={workspace.title} onActivity={recordActivity} />

      {workspace.title === "Projects" ? (
        <ProjectsDeepView
          activeTab={activeTab}
          onActivity={recordActivity}
        />
      ) : null}

      {workspace.title === "Procurement" ? (
        <ProcurementDeepView
          activeTab={activeTab}
          onActivity={recordActivity}
        />
      ) : null}

      {workspace.title === "Inventory" ? (
        <InventoryDeepView
          activeTab={activeTab}
          onActivity={recordActivity}
        />
      ) : null}

      {!["Projects", "Procurement", "Inventory"].includes(workspace.title) ? (
        <UniversalDeepView
          activeTab={activeTab}
          moduleTitle={workspace.title}
          onActivity={recordActivity}
        />
      ) : null}

      <div className="subtab-records separate-page-records">
        <div className="section-heading compact-heading">
          <h2>{activeTab} records</h2>
          <span className="count-badge">{(tabs[activeTab] ?? []).length}</span>
        </div>
        {((projectScreen?.records ?? tabs[activeTab]) ?? []).map((row) => (
          <div className="subtab-row" key={row.join("-")}>
            {row.map((cell) => (
              <span key={cell}>{cell}</span>
            ))}
            <button className="secondary-button compact" onClick={() => recordActivity(`Updated ${row[0]} in ${activeTab}`, "submenu.updated")} type="button">
              Update
            </button>
          </div>
        ))}
      </div>

      <div className="module-records">
        <div className="module-record-row module-record-head">
          {workspace.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
          <span>Operation</span>
        </div>
        {records.map((row, rowIndex) => (
          <div className="module-record-row" key={row.join("-")}>
            {row.map((cell, index) => (
              <span key={`${cell}-${index}`}>{cell}</span>
            ))}
            <span>
              <button className="secondary-button compact" disabled={isWorking} onClick={() => runRecordAction(rowIndex)} type="button">
                {workspace.title === "Procurement" && rowIndex === 0 ? "Draft PO" : "Process"}
              </button>
            </span>
          </div>
        ))}
      </div>

      <div className="module-activity">
        <div className="section-heading compact-heading">
          <h2>Activity and audit preview</h2>
          <span className="count-badge green">{activity.length}</span>
        </div>
        <div className="activity-list">
          {activity.slice(0, 4).map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsDeepView({ activeTab, onActivity }: { activeTab: string; onActivity: (message: string) => void }) {
  if (activeTab === "WBS") {
    return (
      <div className="deep-module-grid">
        {[
          ["1.01", "Excavation and substructure", "92%", "On track"],
          ["1.02", "Tower B slab cycle", "64%", "11 day risk"],
          ["1.03", "Blockwork and plaster", "48%", "Material watch"],
          ["2.01", "MEP first fix", "43%", "Crew shortage"]
        ].map(([code, name, progress, status]) => (
          <article className="deep-card" key={code}>
            <span className="tag">{code}</span>
            <h3>{name}</h3>
            <i className="progress-track"><b style={{ width: progress }} /></i>
            <p>{progress} complete | {status}</p>
            <button className="secondary-button compact" onClick={() => onActivity(`WBS ${code} progress reviewed`)} type="button">Review</button>
          </article>
        ))}
      </div>
    );
  }

  if (activeTab === "DPR") {
    return (
      <div className="deep-form panel-lite">
        <div>
          <label>Project</label>
          <input defaultValue="Skyline Heights - Tower B" />
        </div>
        <div>
          <label>Work date</label>
          <input defaultValue="2026-05-09" type="date" />
        </div>
        <div>
          <label>Labour count</label>
          <input defaultValue="1284" type="number" />
        </div>
        <div>
          <label>Progress summary</label>
          <textarea defaultValue="Tower B slab pour started, shuttering crew short by 18 workers, M30 concrete cube test scheduled." />
        </div>
        <button className="primary-button" onClick={() => onActivity("DPR submitted and routed to Project Manager")} type="button">Submit DPR</button>
        <button className="secondary-button" onClick={() => onActivity("AI generated DPR from photos and voice notes")} type="button">Generate with AI</button>
      </div>
    );
  }

  if (activeTab === "Milestones") {
    return (
      <div className="milestone-lane">
        {[
          ["Foundation", "Done", "100%"],
          ["Structure", "At risk", "68%"],
          ["MEP", "In progress", "43%"],
          ["Finishing", "Upcoming", "12%"],
          ["Handover", "Upcoming", "0%"]
        ].map(([name, status, progress]) => (
          <div className="milestone-step" key={name}>
            <strong>{name}</strong>
            <span>{status}</span>
            <small>{progress}</small>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "Delay Tracker") {
    return (
      <div className="delay-board">
        {[
          ["Tower B shuttering", "11 days", "Add 2 crews and extend night shift"],
          ["Copper cable pull", "5 days", "Release RFQ comparison and approve PO"],
          ["Podium waterproofing", "3 days", "Escalate vendor mobilization"]
        ].map(([reason, delay, action]) => (
          <div className="delay-row" key={reason}>
            <span>
              <strong>{reason}</strong>
              <small>{action}</small>
            </span>
            <b>{delay}</b>
            <button className="secondary-button compact" onClick={() => onActivity(`Delay action created for ${reason}`)} type="button">Create task</button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="site-photo-strip">
      {["Slab pour", "Rebar check", "MEP shaft", "Safety barricade"].map((item) => (
        <button className="photo-tile" key={item} onClick={() => onActivity(`Opened site photo set: ${item}`)} type="button">
          <span>{item}</span>
        </button>
      ))}
    </div>
  );
}

function ProcurementDeepView({ activeTab, onActivity }: { activeTab: string; onActivity: (message: string) => void }) {
  async function createPo() {
    try {
      const response = await fetch("http://127.0.0.1:7001/api/v1/tenants/tenant-nirmaan/procurement/mat-tmt/draft-po", { method: "POST" });
      const payload = (await response.json()) as { poNumber?: string };
      onActivity(`Procurement API created ${payload.poNumber ?? "draft PO"}`);
    } catch {
      onActivity("Draft PO failed because API is offline");
    }
  }

  if (activeTab === "Material Requests") {
    return (
      <div className="deep-form panel-lite">
        <div>
          <label>Project</label>
          <input defaultValue="Skyline Heights - Tower B" />
        </div>
        <div>
          <label>Material</label>
          <input defaultValue="Fe 500D TMT steel" />
        </div>
        <div>
          <label>Required quantity</label>
          <input defaultValue="320 MT" />
        </div>
        <div>
          <label>Requirement note</label>
          <textarea defaultValue="Required for Tower B slab cycle. Current store stock is below reorder point." />
        </div>
        <button className="primary-button" onClick={() => onActivity("Material request submitted for approval")} type="button">Submit MR</button>
        <button className="secondary-button" onClick={() => onActivity("AI checked stock, BOQ balance, and consumption forecast")} type="button">Check with AI</button>
      </div>
    );
  }

  if (activeTab === "RFQs") {
    return (
      <div className="deep-module-grid">
        {[
          ["RFQ-778", "TMT steel", "3 vendors", "Closes today"],
          ["RFQ-779", "Copper cable", "5 vendors", "Open"],
          ["RFQ-780", "RMC M30", "2 vendors", "Negotiation"],
          ["RFQ-781", "Tiles", "4 vendors", "Draft"]
        ].map(([rfq, item, vendors, status]) => (
          <article className="deep-card" key={rfq}>
            <span className="tag">{rfq}</span>
            <h3>{item}</h3>
            <p>{vendors} | {status}</p>
            <button className="secondary-button compact" onClick={() => onActivity(`${rfq} reminder sent to vendors`)} type="button">Send reminder</button>
          </article>
        ))}
      </div>
    );
  }

  if (activeTab === "Comparison") {
    return (
      <div className="comparison-board">
        {[
          ["JSW Steel", "Rs 58,200/MT", "7 days", "Recommended"],
          ["Tata Steel", "Rs 59,100/MT", "5 days", "Fastest"],
          ["SAIL", "Rs 57,900/MT", "12 days", "Slow delivery"]
        ].map(([vendor, rate, delivery, note]) => (
          <div className="comparison-row" key={vendor}>
            <strong>{vendor}</strong>
            <span>{rate}</span>
            <span>{delivery}</span>
            <em>{note}</em>
          </div>
        ))}
        <button className="primary-button" onClick={createPo} type="button">Create PO from recommendation</button>
      </div>
    );
  }

  if (activeTab === "Purchase Orders") {
    return (
      <div className="delay-board">
        {[
          ["PO-4421", "M30 ready-mix concrete", "Approved"],
          ["DRAFT-PO", "TMT steel", "CFO approval needed"],
          ["PO-4422", "Copper cable", "Vendor confirmation"]
        ].map(([po, item, status]) => (
          <div className="delay-row" key={po}>
            <span>
              <strong>{po}</strong>
              <small>{item}</small>
            </span>
            <b>{status}</b>
            <button className="secondary-button compact" onClick={() => onActivity(`${po} routed for approval`)} type="button">Route</button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="milestone-lane">
      {[
        ["TMT steel", "12 May", "Gate pass pending"],
        ["RMC M30", "Today", "Approved"],
        ["Copper cable", "18 May", "PO pending"],
        ["Tiles", "22 May", "Scheduled"],
        ["Cement", "Daily", "Running"]
      ].map(([item, date, status]) => (
        <div className="milestone-step" key={item}>
          <strong>{item}</strong>
          <span>{date}</span>
          <small>{status}</small>
        </div>
      ))}
    </div>
  );
}

function InventoryDeepView({ activeTab, onActivity }: { activeTab: string; onActivity: (message: string) => void }) {
  if (activeTab === "Stock") {
    return (
      <div className="stock-ledger">
        {[
          ["STL-TMT-500D", "Fe 500D TMT steel", "74 MT", "Low stock"],
          ["CEM-OPC-53", "OPC 53 cement", "3,420 bags", "OK"],
          ["CBL-CU-3.5C", "Copper cable", "3.2 km", "Low stock"],
          ["TIL-VIT-600", "Vitrified tiles", "18,400 sqft", "OK"]
        ].map(([sku, item, qty, status]) => (
          <div className="comparison-row" key={sku}>
            <strong>{sku}</strong>
            <span>{item}</span>
            <span>{qty}</span>
            <em>{status}</em>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "GRN") {
    return (
      <div className="deep-form panel-lite">
        <div>
          <label>PO number</label>
          <input defaultValue="PO-4421" />
        </div>
        <div>
          <label>Vendor</label>
          <input defaultValue="ACC RMC" />
        </div>
        <div>
          <label>Received quantity</label>
          <input defaultValue="120 m3" />
        </div>
        <div>
          <label>QC note</label>
          <textarea defaultValue="M30 ready-mix concrete received. Slump test passed. Cube samples collected." />
        </div>
        <button className="primary-button" onClick={() => onActivity("GRN created and stock ledger updated")} type="button">Create GRN</button>
        <button className="secondary-button" onClick={() => onActivity("QC hold added to GRN")} type="button">Put on QC hold</button>
      </div>
    );
  }

  if (activeTab === "Issue") {
    return (
      <div className="deep-form panel-lite">
        <div>
          <label>Project</label>
          <input defaultValue="Skyline Heights - Tower B" />
        </div>
        <div>
          <label>Material</label>
          <input defaultValue="Fe 500D TMT steel" />
        </div>
        <div>
          <label>Issue quantity</label>
          <input defaultValue="28 MT" />
        </div>
        <div>
          <label>Issue purpose</label>
          <textarea defaultValue="Steel issue for Tower B level 18 slab reinforcement." />
        </div>
        <button className="primary-button" onClick={() => onActivity("Material issue slip approved and QR movement generated")} type="button">Approve issue</button>
        <button className="secondary-button" onClick={() => onActivity("Issue request routed to store manager")} type="button">Route approval</button>
      </div>
    );
  }

  if (activeTab === "Transfers") {
    return (
      <div className="delay-board">
        {[
          ["TR-221", "Pune Central to Ahmedabad Store", "Tiles - 8,000 sqft"],
          ["TR-222", "Hyderabad MEP to Airport Site", "Copper cable - 2 km"],
          ["TR-223", "Bengaluru Depot to Metro C7", "Cement - 800 bags"]
        ].map(([transfer, route, material]) => (
          <div className="delay-row" key={transfer}>
            <span>
              <strong>{transfer}</strong>
              <small>{route}</small>
            </span>
            <b>{material}</b>
            <button className="secondary-button compact" onClick={() => onActivity(`${transfer} dispatch confirmed`)} type="button">Dispatch</button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="site-photo-strip">
      {[
        "QR-8821 Steel issued",
        "QR-8822 Cement received",
        "QR-8823 Cable transferred",
        "QR-8824 Scrap moved"
      ].map((scan) => (
        <button className="photo-tile" key={scan} onClick={() => onActivity(`${scan} opened from QR log`)} type="button">
          <span>{scan}</span>
        </button>
      ))}
    </div>
  );
}

function UniversalDeepView({
  activeTab,
  moduleTitle,
  onActivity
}: {
  activeTab: string;
  moduleTitle: string;
  onActivity: (message: string) => void;
}) {
  const config = getUniversalConfig(moduleTitle, activeTab);

  return (
    <div className="universal-deep">
      <div className="operations-board">
        {config.cards.map(([title, value, meta]) => (
          <article className="operation-card" key={title}>
            <div>
              <span className="tag">{activeTab}</span>
              <h3>{title}</h3>
              <p>{value}</p>
            </div>
            <small>{meta}</small>
            <button className="secondary-button compact" onClick={() => onActivity(`${moduleTitle}: ${title} opened`)} type="button">
              Open
            </button>
          </article>
        ))}
      </div>

      <div className="deep-form panel-lite">
        <div className="quick-action-title">
          <strong>Quick action</strong>
          <small>Use this only for fast updates. Main work happens in the boards above.</small>
        </div>
        <div>
          <label>{config.primaryLabel}</label>
          <input defaultValue={config.primaryValue} />
        </div>
        <div>
          <label>Owner</label>
          <input defaultValue={config.owner} />
        </div>
        <div>
          <label>Status</label>
          <input defaultValue={config.status} />
        </div>
        <div>
          <label>Work note</label>
          <textarea defaultValue={config.note} />
        </div>
        <button className="primary-button" onClick={() => onActivity(`${moduleTitle}: ${activeTab} saved`)} type="button">
          Save {activeTab}
        </button>
        <button className="secondary-button" onClick={() => onActivity(`${moduleTitle}: ${activeTab} routed for approval`)} type="button">
          Route approval
        </button>
      </div>
    </div>
  );
}

function ConstructionErpCanvas({ activeSubmenu, moduleTitle, onActivity }: { activeSubmenu: string; moduleTitle: string; onActivity: (message: string, action?: string) => void }) {
  const canvas = getCanvasConfig(moduleTitle, activeSubmenu);

  return (
    <section className="construction-canvas">
      <div className="canvas-main">
        <div className="canvas-heading">
          <div>
            <span className="eyebrow">{canvas.context}</span>
            <h2>{canvas.title}</h2>
          </div>
          <button className="primary-button" onClick={() => onActivity(`${moduleTitle}: AI review started`, "ai.review")} type="button">
            Run AI review
          </button>
        </div>

        <div className="process-lane">
          {canvas.flow.map((step, index) => (
            <div className="process-step" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>

        <div className="site-board">
          {canvas.board.map(([title, metric, status]) => (
            <button className="site-board-card" key={title} onClick={() => onActivity(`${moduleTitle}: opened ${title}`, "board.open")} type="button">
              <strong>{title}</strong>
              <span>{metric}</span>
              <small>{status}</small>
            </button>
          ))}
        </div>
      </div>

      <aside className="canvas-side">
        <h3>Live field signals</h3>
        {canvas.signals.map(([label, value]) => (
          <div className="signal-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </aside>
    </section>
  );
}

function getProjectScreen(activeTab: string) {
  const screens: Record<string, { subtitle: string; stats: [string, string][]; records: string[][] }> = {
    Overview: {
      subtitle: "Project portfolio overview with live site progress, risk, budget, and today's execution signals.",
      stats: [["Active sites", "64"], ["Avg progress", "61%"], ["High risk", "8"], ["DPR pending", "18"]],
      records: [["Skyline Heights", "Pune", "68%", "Delay risk"], ["Metro Depot C7", "Bengaluru", "54%", "On track"], ["Riverfront Villas", "Ahmedabad", "81%", "Billing due"]]
    },
    WBS: {
      subtitle: "Work breakdown structure with planned vs actual progress, owners, dependencies, and variance.",
      stats: [["WBS items", "1,284"], ["Delayed", "42"], ["Critical path", "12"], ["Variance", "7.8%"]],
      records: [["1.01 Excavation", "Planned 100%", "Actual 100%", "Closed"], ["1.02 Slab cycle", "Planned 72%", "Actual 64%", "Delay"], ["2.01 MEP first fix", "Planned 48%", "Actual 43%", "Watch"]]
    },
    DPR: {
      subtitle: "Daily progress reporting with labour, material, photos, voice notes, equipment, and AI auto-drafts.",
      stats: [["DPR drafts", "27"], ["Photos", "312"], ["Voice notes", "8"], ["Labour", "1,284"]],
      records: [["09 May DPR", "1284 labour", "42 photos", "Submit"], ["08 May DPR", "1196 labour", "Approved", "Closed"], ["07 May DPR", "1210 labour", "3 issues", "Reviewed"]]
    },
    Milestones: {
      subtitle: "Milestone tracker showing committed dates, baseline variance, certification, and billing dependencies.",
      stats: [["Milestones", "86"], ["At risk", "12"], ["Completed", "41"], ["Due this week", "9"]],
      records: [["Foundation complete", "Done", "0 day variance", "Certified"], ["Structure level 18", "At risk", "11 day variance", "Action"], ["MEP shaft closure", "In progress", "5 day variance", "Watch"]]
    },
    "Delay Tracker": {
      subtitle: "Delay control center with root cause, responsibility, recovery action, and escalation workflow.",
      stats: [["Delay events", "23"], ["Critical", "7"], ["Recovery tasks", "18"], ["SLA breached", "3"]],
      records: [["Tower B shuttering", "11 days", "Crew shortage", "Escalate"], ["Copper cable pull", "5 days", "Material hold", "Approve PO"], ["Waterproofing", "3 days", "Vendor mobilization", "Create task"]]
    }
  };

  return screens[activeTab];
}

function getCanvasConfig(moduleTitle: string, activeSubmenu = "") {
  const defaults = {
    context: "Construction operations",
    title: `${moduleTitle} control board`,
    flow: ["Capture", "Verify", "Approve", "Post", "Audit"],
    board: [
      ["Open work", "24", "Needs attention"],
      ["Approvals", "8", "SLA tracked"],
      ["Automation", "Live", "Rules running"],
      ["Audit trail", "On", "Traceable"]
    ],
    signals: [["Mobile sync", "Live"], ["Pending approvals", "8"], ["AI alerts", "3"]]
  };

  const configs: Record<string, typeof defaults> = {
    Projects: {
      context: "Site execution",
      title: "Project control board with DPR, WBS, delays, photos, and milestones",
      flow: ["WBS", "DPR", "Progress", "Delay", "Billing"],
      board: [["Tower B", "68%", "11 day risk"], ["Metro Depot", "54%", "On track"], ["Site photos", "312", "Synced"], ["DPRs", "18", "Pending review"]],
      signals: [["Labour present", "1,284"], ["Concrete pour", "Running"], ["Open NCRs", "42"]]
    },
    Procurement: {
      context: "Material procurement",
      title: "Procurement control from MR to RFQ, comparison, PO, delivery, and GRN",
      flow: ["MR", "RFQ", "Compare", "PO", "Delivery"],
      board: [["TMT steel", "320 MT", "PO recommended"], ["Copper cable", "18 km", "RFQ open"], ["RMC M30", "Today", "Delivery approved"], ["Tiles", "42k sqft", "Issue planned"]],
      signals: [["Vendor replies", "18"], ["Savings found", "Rs 38.2 L"], ["Low stock", "9"]]
    },
    Inventory: {
      context: "Stores and warehouse",
      title: "Warehouse movement board with stock, GRN, issue, transfer, QR, and reconciliation",
      flow: ["Gate", "GRN", "QC", "Stock", "Issue"],
      board: [["Pune store", "74 MT steel", "Low"], ["Bengaluru depot", "3420 bags", "OK"], ["Hyderabad MEP", "3.2 km cable", "Low"], ["QR scans", "1,842", "Today"]],
      signals: [["GRNs today", "26"], ["Transfers", "7"], ["Reconciliation", "98.1%"]]
    },
    "Finance and GST": {
      context: "Finance compliance",
      title: "Finance board for AP, AR, GST, TDS, e-invoice, e-way bill, and payments",
      flow: ["OCR", "Match", "Approve", "Post", "Pay"],
      board: [["AP invoices", "Rs 22.4 Cr", "Vendor dues"], ["GST", "Rs 6.8 Cr", "Review"], ["AR", "Rs 41.1 Cr", "Outstanding"], ["Payments", "12", "Approval due"]],
      signals: [["OCR accuracy", "97.2%"], ["Bank recon", "Ready"], ["E-way bill", "Connected"]]
    }
  };

  if (moduleTitle === "Projects") {
    const projectConfigs: Record<string, typeof defaults> = {
      Overview: configs.Projects,
      WBS: {
        context: "Project WBS",
        title: "WBS control board with planned vs actual progress and dependency risks",
        flow: ["Define WBS", "Assign owner", "Update actual", "Check variance", "Escalate"],
        board: [["Slab cycle", "64%", "11 day risk"], ["MEP first fix", "43%", "Watch"], ["Waterproofing", "88%", "3 day risk"], ["Finishing", "12%", "Upcoming"]],
        signals: [["Critical path", "12 items"], ["Variance", "7.8%"], ["Owners pending", "6"]]
      },
      DPR: {
        context: "Daily site reporting",
        title: "DPR workspace with labour, material, photos, equipment, and AI draft",
        flow: ["Capture", "Verify", "Attach photos", "Submit", "Approve"],
        board: [["Labour", "1,284", "Face matched"], ["Photos", "42", "Geo tagged"], ["Materials", "4 issues", "Synced"], ["AI draft", "Ready", "Review"]],
        signals: [["Offline sync", "27 drafts"], ["Voice notes", "8"], ["Equipment", "14 used"]]
      },
      Milestones: {
        context: "Milestone control",
        title: "Milestone board with baseline, actual, certification, and billing linkage",
        flow: ["Baseline", "Progress", "Certify", "Bill", "Close"],
        board: [["Foundation", "100%", "Certified"], ["Structure", "68%", "At risk"], ["MEP", "43%", "In progress"], ["Handover", "0%", "Upcoming"]],
        signals: [["Due this week", "9"], ["At risk", "12"], ["Billing linked", "6"]]
      },
      "Delay Tracker": {
        context: "Delay control",
        title: "Delay tracker with root cause, recovery plan, SLA, and escalation",
        flow: ["Detect", "Classify", "Assign", "Recover", "Close"],
        board: [["Shuttering", "11 days", "Critical"], ["Cable pull", "5 days", "Material"], ["Waterproofing", "3 days", "Vendor"], ["Approvals", "2 days", "SLA"]],
        signals: [["Critical delays", "7"], ["Recovery tasks", "18"], ["Escalations", "3"]]
      }
    };

    return projectConfigs[activeSubmenu] ?? configs.Projects;
  }

  return configs[moduleTitle] ?? defaults;
}

function getUniversalConfig(moduleTitle: string, activeTab: string) {
  const presets: Record<string, { primaryLabel: string; primaryValue: string; owner: string; status: string; note: string; cards: string[][] }> = {
    "Executive cockpit": {
      primaryLabel: "Board review",
      primaryValue: "Monthly executive pack",
      owner: "CEO office",
      status: "Live",
      note: "Revenue, project risk, approvals, cashflow, labour productivity, and compliance KPIs are ready for review.",
      cards: [["Revenue", "Rs 184.2 Cr", "12.6% up"], ["Project health", "86%", "8 high-risk sites"], ["Approvals", "32 pending", "SLA tracked"], ["Cashflow", "94 days", "Healthy"]]
    },
    "Organization and Admin": {
      primaryLabel: "Admin record",
      primaryValue: "Approval hierarchy",
      owner: "System admin",
      status: "Draft",
      note: "Role permissions, branch mapping, SSO, notification rules, and escalation matrix can be configured here.",
      cards: [["Companies", "4", "Multi-company"], ["Branches", "18", "India operations"], ["Roles", "26", "RBAC"], ["Audit", "1,284 events", "Traceable"]]
    },
    "CRM and sales": {
      primaryLabel: "Lead or booking",
      primaryValue: "Tower B - Unit 1204",
      owner: "Sales manager",
      status: "Hot lead",
      note: "Lead source, site visit, quotation, booking, channel partner, and WhatsApp follow-up are connected.",
      cards: [["Leads", "248", "42 hot"], ["Site visits", "71", "Scheduled"], ["Bookings", "18", "This month"], ["Quotations", "36", "Auto-generated"]]
    },
    "Tendering and estimation": {
      primaryLabel: "Tender package",
      primaryValue: "Metro package civil BOQ",
      owner: "Estimation team",
      status: "In review",
      note: "BOQ, rate analysis, vendor quotation, margin, OCR import, and AI estimate are tracked together.",
      cards: [["Tenders", "12", "Active"], ["BOQs", "28", "Imported"], ["Quotes", "64", "Compared"], ["AI variance", "3.8%", "Within range"]]
    },
    Contractors: {
      primaryLabel: "Contractor bill",
      primaryValue: "Shivam Contractors RA-441",
      owner: "Billing engineer",
      status: "MB verified",
      note: "Measurement book, work certification, retention, ledger, labour billing, and RA bill approvals are linked.",
      cards: [["Work orders", "86", "Active"], ["MB", "17", "Pending"], ["RA bills", "22", "Queue"], ["Retention", "Rs 4.6 Cr", "Held"]]
    },
    "Labour management": {
      primaryLabel: "Labour batch",
      primaryValue: "Tower B shuttering crew",
      owner: "Site HR",
      status: "Attendance synced",
      note: "Face attendance, geo-tagging, shifts, wages, overtime, onboarding, and productivity are monitored.",
      cards: [["Workers", "4,812", "Onboarded"], ["Present", "91.4%", "Today"], ["OT", "326 hrs", "Review"], ["Exceptions", "28", "Geo mismatch"]]
    },
    "Plant and machinery": {
      primaryLabel: "Equipment",
      primaryValue: "Concrete pump P-04",
      owner: "Plant head",
      status: "Allocated",
      note: "Equipment allocation, GPS, fuel, maintenance, breakdown, utilization, and spare tracking are connected.",
      cards: [["Equipment", "138", "Tracked"], ["Utilization", "76%", "Good"], ["Breakdowns", "5", "Open"], ["Fuel alerts", "2", "Investigate"]]
    },
    "QA/QC": {
      primaryLabel: "Quality record",
      primaryValue: "Slab reinforcement IR-882",
      owner: "QA engineer",
      status: "Open",
      note: "Inspection requests, NCR, test reports, cube tracking, checklists, and snags are managed here.",
      cards: [["IRs", "31", "Open"], ["NCRs", "42", "Tracked"], ["Cube tests", "28", "Scheduled"], ["Snags", "137", "Grouped"]]
    },
    "Safety EHS": {
      primaryLabel: "Safety record",
      primaryValue: "Work at height PTW-331",
      owner: "EHS officer",
      status: "Approval needed",
      note: "Permit-to-work, incidents, PPE, toolbox talks, risk assessment, and compliance reminders are active.",
      cards: [["Permits", "16", "Open"], ["Incidents", "3", "Escalated"], ["PPE gaps", "22", "Action"], ["Toolbox", "92%", "Done"]]
    },
    "Finance and GST": {
      primaryLabel: "Finance transaction",
      primaryValue: "ACC Cement invoice",
      owner: "Accounts payable",
      status: "OCR matched",
      note: "AP, AR, GST, TDS, e-invoice, e-way bill, reconciliation, and payment approval are connected.",
      cards: [["GST", "Rs 6.8 Cr", "Review"], ["Vendor dues", "Rs 22.4 Cr", "Payable"], ["AR", "Rs 41.1 Cr", "Outstanding"], ["OCR", "97.2%", "Accurate"]]
    },
    "Payroll and HRMS": {
      primaryLabel: "Payroll record",
      primaryValue: "May salary batch",
      owner: "HR payroll",
      status: "Ready",
      note: "Employee records, attendance, leave, payroll, reimbursements, recruitment, PF, ESI, PT, and onboarding are ready.",
      cards: [["Employees", "742", "Active"], ["Leave", "18", "Pending"], ["Payroll", "Ready", "May"], ["PF/ESI", "Compliant", "Ready"]]
    },
    "Document management": {
      primaryLabel: "Document",
      primaryValue: "Tower B structural drawing R4",
      owner: "DMS controller",
      status: "Approved",
      note: "Drawing versions, contracts, OCR search, digital signatures, tags, approval, and expiry reminders are handled.",
      cards: [["Documents", "18,420", "Indexed"], ["Drawings", "4,812", "Versioned"], ["OCR", "0 queue", "Clear"], ["Expiry", "9", "Due"]]
    },
    "Customer portal": {
      primaryLabel: "Customer record",
      primaryValue: "Unit 1204 buyer update",
      owner: "CRM",
      status: "Ready to notify",
      note: "Booking status, payments, construction updates, complaints, service requests, downloads, and chatbot are connected.",
      cards: [["Customers", "2,846", "Active"], ["Bookings", "624", "Live"], ["Complaints", "31", "Open"], ["Updates", "8,420", "Sent"]]
    },
    "Asset and facility": {
      primaryLabel: "Asset record",
      primaryValue: "HVAC AMC renewal",
      owner: "Facility manager",
      status: "Due",
      note: "Asset lifecycle, preventive maintenance, warranty, AMC, facility requests, and renewals are tracked.",
      cards: [["Assets", "3,218", "Tagged"], ["AMC", "14", "Due"], ["Warranty", "22", "Expiring"], ["Requests", "48", "Open"]]
    },
    "BI and analytics": {
      primaryLabel: "Analytics report",
      primaryValue: "Project profitability dashboard",
      owner: "BI team",
      status: "Live",
      note: "Executive dashboards, profitability, cashflow, resources, delays, forecasts, and AI recommendations are live.",
      cards: [["Dashboards", "18", "Live"], ["Profitability", "14.8%", "Average"], ["Overrun", "3", "Projects"], ["AI alerts", "27", "Open"]]
    },
    "Workflow engine": {
      primaryLabel: "Workflow rule",
      primaryValue: "Stock low to draft PO",
      owner: "Automation admin",
      status: "Enabled",
      note: "No-code triggers, conditional approvals, SLA, escalations, auto tasks, and vendor onboarding are configured.",
      cards: [["Workflows", "147", "Enabled"], ["SLA", "98.4%", "Met"], ["Escalations", "11", "Open"], ["Auto tasks", "628", "Created"]]
    },
    "AI automation": {
      primaryLabel: "AI agent",
      primaryValue: "Project risk agent",
      owner: "AI operations",
      status: "Running",
      note: "Chatbot, voice, OCR, forecasting, schedule prediction, procurement optimization, risk, anomaly, and report generation are active.",
      cards: [["Agents", "12", "Running"], ["OCR", "97.2%", "Accuracy"], ["Forecasts", "38", "Updated"], ["Anomalies", "7", "Open"]]
    },
    "Mobile apps": {
      primaryLabel: "Mobile workflow",
      primaryValue: "Site engineer DPR app",
      owner: "Mobile operations",
      status: "Offline ready",
      note: "Management, site engineer, labour, vendor, and customer apps support offline, geo, camera, voice, and push notifications.",
      cards: [["Offline DPRs", "27", "Drafts"], ["Geo punches", "1,842", "Synced"], ["Vendor uploads", "36", "OCR"], ["Customer updates", "8,420", "Sent"]]
    }
  };

  return presets[moduleTitle] ?? {
    primaryLabel: "Record",
    primaryValue: activeTab,
    owner: "Module owner",
    status: "Active",
    note: `${moduleTitle} ${activeTab} workflow is ready.`,
    cards: [["Records", "Ready", "Active"], ["Approvals", "Digital", "Enabled"], ["Audit", "Traceable", "On"], ["Automation", "Ready", "On"]]
  };
}
