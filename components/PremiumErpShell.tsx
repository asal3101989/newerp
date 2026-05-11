"use client";
// Forced rebuild

import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Camera,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Eye,
  Factory,
  FileCheck2,
  FileClock,
  FileSpreadsheet,
  FileText,
  HardHat,
  Headphones,
  Home,
  IndianRupee,
  Landmark,
  LogOut,
  MapPin,
  Menu,
  PackageCheck,
  Pencil,
  ScanLine,
  Search,
  SendHorizonal,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Truck,
  UploadCloud,
  UserCog,
  Users,
  Warehouse,
  Workflow,
  X,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area, AreaChart, CartesianGrid, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import {
  aiChat, aiForecast, aiInsights, aiOcr,
  apiGet, apiPost, DEFAULT_TENANT_ID,
  fetchRecords, createRecord, updateRecord, deleteRecord,
  generateEInvoice, getGstrStatus, loginToApi, logoutFromApi, validateGstin,
  type AiChatMessage, type AiChatResult, type AiForecastResult, type AiInsight, type AiOcrResult,
  type GstrStatusResult
} from "@/lib/api-client";

type Row = {
  id: string;
  primary: string;
  secondary: string;
  value: string;
  owner: string;
  status: string;
};

type ModulePage = {
  screen: string;
  parentScreen?: string;
  permission: string;
  group: string;
  title: string;
  subtitle: string;
  action: string;
  icon: LucideIcon;
  accent: string;
  stats: Array<{ label: string; value: string; tone: string }>;
  automations: string[];
  workflows: string[];
  columns: string[];
  rows: Row[];
};

type ModalState =
  | { mode: "create"; row?: undefined }
  | { mode: "edit" | "view" | "delete"; row: Row }
  | null;

type ApiState = {
  connected: boolean;
    loading: boolean;
  health?: {
    database?: string;
    ok: boolean;
    mode: string;
    counts: Record<string, number>;
  };
  dashboard?: {
    kpis?: Record<string, number>;
    projects?: Array<Record<string, string | number>>;
    approvals?: Array<Record<string, string | number>>;
    lowStock?: Array<Record<string, string | number>>;
    aiBrief?: string[];
  };
  procurement?: any;
  inventory?: Array<Record<string, string | number>>;
  finance?: Record<string, string | number>;
  documents?: Array<Record<string, string | number>>;
  workflows?: Array<Record<string, string | number | string[] | boolean>>;
  user?: { name: string; permissions: string[]; role: string };
  aiInsights?: AiInsight[];
  gstrStatus?: GstrStatusResult;
};

const modules: ModulePage[] = [
  {
    screen: "admin",
    group: "ADMIN",
    permission: "admin.manage",
    title: "Organization & Admin",
    subtitle: "Multi-company control, RBAC, approval hierarchy, audit logs, SSO, workflow builder, notifications, and escalation routing.",
    action: "Create Role",
    icon: UserCog,
    accent: "#1B3A6B",
    stats: [
      { label: "Total Users", value: "0", tone: "text-primary" },
      { label: "Active Roles", value: "0", tone: "text-success" },
      { label: "Departments", value: "0", tone: "text-accent" },
      { label: "Branches", value: "0", tone: "text-warning" },
      { label: "Pending Approvals", value: "0", tone: "text-danger" },
      { label: "Audit Events Today", value: "0", tone: "text-primary" }
    ],
    automations: ["Auto role assignment on hire", "Approval route builder", "Pending approval escalation", "SSO policy sync", "Audit log archival", "Onboarding checklist trigger"],
    workflows: ["User invited", "Department mapped", "Role assigned", "Approval matrix active", "SSO configured", "Audit trail locked", "System settings saved"],
    columns: ["User/Entity", "Company", "Role/Flow", "SLA", "Owner", "Status"],
    rows: []
  },
  {
    screen: "crm",
    group: "SALES",
    permission: "crm.view",
    title: "CRM & Lead Management",
    subtitle: "Lead capture from website, WhatsApp, ads, channel partners, site visits, unit inventory, bookings, quotations, and onboarding.",
    action: "Add Lead",
    icon: Headphones,
    accent: "#2B6CB0",
    stats: [],
    automations: ["AI lead scoring", "WhatsApp chatbot", "Auto quotation", "Conversion prediction"],
    workflows: ["Lead captured", "Score calculated", "Site visit booked", "Quotation sent", "Booking confirmed"],
    columns: ["Lead ID", "Customer", "Source", "Value", "Sales Owner", "Status"],
    rows: []
  },
  {
    screen: "tendering",
    group: "PRE-CONSTRUCTION",
    permission: "tender.view",
    title: "Tendering & Estimation",
    subtitle: "BOQ preparation, rate analysis, tender comparison, vendor quotations, margin calculations, and drawing-based quantity extraction.",
    action: "Create Tender",
    icon: FileSpreadsheet,
    accent: "#C9A84C",
    stats: [],
    automations: ["OCR tender import", "AI cost estimation", "Vendor comparison", "BOQ Excel/PDF parser"],
    workflows: ["Tender received", "BOQ extracted", "Rates analysed", "Margin reviewed", "Bid submitted"],
    columns: ["Tender ID", "Package", "Client", "Bid Value", "Owner", "Status"],
    rows: []
  },
  {
    screen: "projects",
    group: "PROJECTS",
    permission: "project.view",
    title: "Project Planning & Execution",
    subtitle: "WBS, milestones, Gantt planning, DPR, Primavera/MS Project imports, resources, dependencies, baseline vs actual, and health scoring.",
    action: "Add DPR",
    icon: ClipboardCheck,
    accent: "#2F855A",
    stats: [],
    automations: ["AI delay prediction", "Auto DPR generation", "Smart task assignment", "Project health score"],
    workflows: ["WBS created", "Baseline locked", "DPR synced", "Delay analysed", "Action assigned"],
    columns: ["Project ID", "Project", "Location", "Progress", "Engineer", "Health"],
    rows: []
  },
  {
    screen: "procurement",
    group: "PROCUREMENT",
    permission: "po.approve",
    title: "Procurement & Purchase",
    subtitle: "Material requisitions, RFQs, vendor portal, comparative statements, POs, approvals, delivery schedules, and price intelligence.",
    action: "Create PO",
    icon: PackageCheck,
    accent: "#1B3A6B",
    stats: [],
    automations: ["Auto PO creation", "AI vendor recommendation", "Reorder alerts", "Smart price comparison"],
    workflows: ["MR approved", "RFQ issued", "Comparison ready", "PO approved", "Delivery tracked"],
    columns: ["PO/RFQ", "Vendor", "Project", "Amount", "Buyer", "Status"],
    rows: []
  },
  {
    screen: "inventory",
    group: "STORES",
    permission: "inventory.view",
    title: "Inventory & Warehouse",
    subtitle: "Multi-warehouse stock, inward/outward, GRN, batch tracking, QR/barcode movement, gate pass, scrap, transfers, and reconciliation.",
    action: "Create GRN",
    icon: Warehouse,
    accent: "#2B6CB0",
    stats: [],
    automations: ["AI consumption forecast", "QR movement", "Auto reconciliation", "Stock alert engine"],
    workflows: ["Gate entry", "GRN posted", "QC checked", "Stock updated", "Issue tracked"],
    columns: ["Item/GRN", "Material", "Store", "Stock/Qty", "Keeper", "Status"],
    rows: []
  },
  {
    screen: "contractors",
    group: "CONTRACTORS",
    permission: "ra_bill.verify",
    title: "Contractor & Subcontractor",
    subtitle: "Work orders, running bills, RA bills, measurement books, retention, contractor ledgers, labour billing, and work certification.",
    action: "Generate RA Bill",
    icon: BriefcaseBusiness,
    accent: "#C05621",
    stats: [],
    automations: ["Auto RA calculation", "Digital MB verification", "AI billing anomaly detection", "Retention auto-posting"],
    workflows: ["Work certified", "MB verified", "RA generated", "Tax checked", "Payment approved"],
    columns: ["Bill/WO", "Contractor", "Project", "Net Payable", "Approver", "Status"],
    rows: []
  },
  {
    screen: "labour",
    group: "WORKFORCE",
    permission: "labour.view",
    title: "Labour Management",
    subtitle: "Worker onboarding, Aadhaar verification, biometric and geo-tag attendance, shifts, wage calculation, overtime, and productivity tracking.",
    action: "Onboard Worker",
    icon: Users,
    accent: "#2F855A",
    stats: [],
    automations: ["Face attendance", "Auto payroll", "Geo-fence alerts", "AI productivity analytics"],
    workflows: ["Worker verified", "Attendance captured", "Shift closed", "Wages calculated", "Payroll posted"],
    columns: ["Worker/Site", "Trade", "Attendance", "Wage/Output", "Supervisor", "Status"],
    rows: []
  },
  {
    screen: "machinery",
    group: "ASSETS",
    permission: "machinery.view",
    title: "Plant & Machinery",
    subtitle: "Equipment allocation, GPS tracking, fuel logs, maintenance schedules, breakdowns, utilization, spare parts, and IoT sensor monitoring.",
    action: "Allocate Equipment",
    icon: Factory,
    accent: "#C9A84C",
    stats: [],
    automations: ["Predictive maintenance", "Fuel anomaly detection", "Auto service reminders", "GPS trip matching"],
    workflows: ["Allocated", "Fuel captured", "IoT monitored", "Service due", "Breakdown closed"],
    columns: ["Asset ID", "Equipment", "Project", "Usage/Fuel", "Owner", "Status"],
    rows: []
  },
  {
    screen: "quality",
    group: "COMPLIANCE",
    permission: "quality.view",
    title: "Quality Management QA/QC",
    subtitle: "Inspection requests, quality checklists, NCRs, test reports, concrete cube tracking, snag management, and mobile inspection workflows.",
    action: "Schedule Inspection",
    icon: FileCheck2,
    accent: "#2B6CB0",
    stats: [],
    automations: ["AI defect detection", "Auto inspection scheduling", "Checklist workflow", "NCR escalation"],
    workflows: ["IR raised", "Checklist done", "Test linked", "NCR closed", "Report archived"],
    columns: ["IR/NCR", "Inspection", "Project", "Result", "QA Owner", "Status"],
    rows: []
  },
  {
    screen: "safety",
    group: "COMPLIANCE",
    permission: "safety.view",
    title: "Safety Management EHS",
    subtitle: "Safety permits, incidents, PPE tracking, toolbox talks, risk assessments, compliance checklists, and incident escalation workflows.",
    action: "Issue Permit",
    icon: ShieldCheck,
    accent: "#C53030",
    stats: [],
    automations: ["AI risk alerts", "Compliance reminders", "Incident escalation", "Permit expiry alerts"],
    workflows: ["Permit requested", "Risk scored", "Approval issued", "Site checked", "Incident closed"],
    columns: ["Permit/Incident", "Activity", "Project", "Risk", "EHS Owner", "Status"],
    rows: []
  },
  {
    screen: "finance",
    group: "FINANCE",
    permission: "finance.approve",
    title: "Finance & Indian Compliance",
    subtitle: "GL, AP, AR, bank reconciliation, budgeting, fixed assets, cost centers, GST, TDS, e-invoicing, e-way bill, GSTR and MSME compliance.",
    action: "Create Voucher",
    icon: Landmark,
    accent: "#1B3A6B",
    stats: [],
    automations: ["OCR invoice entry", "Auto bank reconciliation", "AI cashflow prediction", "Payment reminders"],
    workflows: ["Invoice OCR", "GST checked", "TDS applied", "Approval routed", "Payment released"],
    columns: ["Txn ID", "Party", "Compliance", "Amount", "Finance Owner", "Status"],
    rows: []
  },
  {
    screen: "hrms",
    group: "WORKFORCE",
    permission: "payroll.view",
    title: "Payroll & HRMS",
    subtitle: "Employee database, leave, payroll, reimbursements, recruitment, asset assignment, PF, ESI, PT, and labour law compliance.",
    action: "Run Payroll",
    icon: CreditCard,
    accent: "#2F855A",
    stats: [],
    automations: ["Auto salary processing", "AI leave forecasting", "Automated onboarding", "Compliance checklist"],
    workflows: ["Attendance imported", "Leave adjusted", "Payroll calculated", "PF/ESI checked", "Salary released"],
    columns: ["Employee/Batch", "Department", "Compliance", "Amount", "HR Owner", "Status"],
    rows: []
  },
  {
    screen: "documents",
    group: "DOCUMENTS",
    permission: "documents.view",
    title: "Document Management System",
    subtitle: "Drawing management, version control, contract storage, OCR search, digital signatures, file tagging, approvals, and expiry reminders.",
    action: "Upload Drawing",
    icon: FileClock,
    accent: "#2B6CB0",
    stats: [],
    automations: ["AI document classification", "Expiry reminders", "Smart search", "Version lock"],
    workflows: ["Uploaded", "OCR indexed", "Tagged", "Approved", "Published"],
    columns: ["Doc ID", "Document", "Folder", "Version", "Owner", "Status"],
    rows: []
  },
  {
    screen: "customer",
    group: "PORTALS",
    permission: "customer.view",
    title: "Customer Portal & Mobile App",
    subtitle: "Booking status, payments, construction updates, complaints, service requests, documents, WhatsApp updates, and AI chatbot support.",
    action: "Send Update",
    icon: Smartphone,
    accent: "#C9A84C",
    stats: [],
    automations: ["Auto project updates", "WhatsApp notifications", "AI chatbot support", "Payment reminder bot"],
    workflows: ["Booking synced", "Demand raised", "Payment updated", "Progress shared", "Complaint closed"],
    columns: ["Request/Booking", "Customer", "Project", "Value", "Owner", "Status"],
    rows: []
  },
  {
    screen: "facility",
    group: "ASSETS",
    permission: "facility.view",
    title: "Asset & Facility Management",
    subtitle: "Asset lifecycle, preventive maintenance, warranty tracking, AMC management, facility requests, predictive maintenance, and renewals.",
    action: "Create Work Order",
    icon: Building2,
    accent: "#2B6CB0",
    stats: [],
    automations: ["Predictive maintenance", "AMC renewal reminders", "Warranty alerts", "Facility SLA routing"],
    workflows: ["Asset tagged", "PM scheduled", "Complaint assigned", "Work completed", "AMC renewed"],
    columns: ["Asset/WO", "Asset", "Location", "SLA/Date", "Owner", "Status"],
    rows: []
  },
  {
    screen: "analytics",
    group: "AI & BI",
    permission: "analytics.view",
    title: "Business Intelligence & AI Analytics",
    subtitle: "Executive dashboards, real-time KPIs, profitability, cashflow, resources, delays, forecasting, risk prediction, and recommendations.",
    action: "Generate Insight",
    icon: BarChart3,
    accent: "#1B3A6B",
    stats: [],
    automations: ["Cost overrun prediction", "Delay analytics", "Cashflow forecast", "AI recommendations"],
    workflows: ["Data synced", "Model scored", "Insight generated", "Owner assigned", "Executive brief sent"],
    columns: ["Report/Model", "Scope", "Signal", "Freshness", "Owner", "Status"],
    rows: []
  },
  {
    screen: "workflow",
    group: "AI & BI",
    permission: "workflow.manage",
    title: "Workflow Automation Engine",
    subtitle: "No-code workflow builder, conditional approvals, trigger actions, SLA monitoring, escalation matrix, and auto task creation.",
    action: "Build Workflow",
    icon: Workflow,
    accent: "#C9A84C",
    stats: [],
    automations: ["Conditional approvals", "Trigger actions", "Escalation matrix", "Vendor onboarding bot"],
    workflows: ["Trigger received", "Condition checked", "Approval routed", "SLA monitored", "Action executed"],
    columns: ["Flow ID", "Workflow", "Trigger", "Runs", "Owner", "Status"],
    rows: []
  },
  {
    screen: "mobile",
    group: "PORTALS",
    permission: "mobile.view",
    title: "Mobile Applications",
    subtitle: "Management, site engineer, labour attendance, vendor, and customer apps with offline mode, geo-tagging, camera uploads, voice notes, and push notifications.",
    action: "Publish App Config",
    icon: Smartphone,
    accent: "#2F855A",
    stats: [],
    automations: ["Offline sync queue", "Geo-tag validation", "Camera OCR", "Push notification rules"],
    workflows: ["Offline captured", "Geo-tag checked", "Photo uploaded", "Approval pushed", "Sync completed"],
    columns: ["App/Device", "User Group", "Feature", "Sync", "Owner", "Status"],
    rows: []
  },
  {
    screen: "ai",
    group: "AI & BI",
    permission: "ai.use",
    title: "AI & Advanced Automation",
    subtitle: "AI assistant, voice commands, OCR, forecasting, schedule prediction, procurement optimization, risk analysis, reports, and anomaly detection.",
    action: "Run AI Agent",
    icon: Bot,
    accent: "#1B3A6B",
    stats: [],
    automations: ["Voice operations", "AI report generation", "Procurement optimizer", "Risk and cashflow agents"],
    workflows: ["Prompt received", "Data retrieved", "Agent reasoned", "Action drafted", "Human approved"],
    columns: ["Agent ID", "AI Agent", "Domain", "Impact", "Owner", "Status"],
    rows: []
  }
];

const navGroups = [
  { label: "MAIN", screens: ["dashboard"] },
  { label: "ADMIN", screens: ["admin", "workflow"] },
  { label: "SALES", screens: ["crm", "customer"] },
  { label: "PRE-CONSTRUCTION", screens: ["tendering"] },
  { label: "PROJECT DELIVERY", screens: ["projects", "contractors", "quality", "safety"] },
  { label: "COMMERCIAL", screens: ["procurement", "inventory", "finance"] },
  { label: "WORKFORCE & ASSETS", screens: ["labour", "hrms", "machinery", "facility"] },
  { label: "DIGITAL", screens: ["documents", "mobile", "analytics", "ai"] }
];

const moduleByScreen = Object.fromEntries(modules.map((module) => [module.screen, module])) as Record<string, ModulePage>;

const submenuLabels: Record<string, string[]> = {
  admin: ["Companies", "Branches", "Departments", "Users", "Roles", "Permissions", "Approval Matrix", "Audit Logs", "System Settings", "Tax Setup", "Email Templates", "API Webhooks", "Security & SSO"],
  crm: ["Leads", "Site Visits", "Bookings", "Quotations", "Channel Partners", "Customer Onboarding"],
  tendering: ["BOQ", "Rate Analysis", "Tender Comparison", "Vendor Quotes", "Bid Submission", "Drawing Quantity"],
  projects: ["WBS", "DPR", "Gantt", "Milestones", "Delay Tracking", "Resources"],
  procurement: ["Material Requisition", "RFQ", "Comparative Statement", "Purchase Orders", "Delivery Schedule", "Vendor Portal"],
  inventory: ["Stock", "GRN", "Material Issue", "Stock Transfer", "Gate Pass", "Scrap"],
  contractors: ["Work Orders", "Measurement Book", "RA Bills", "Retention", "Contractor Ledger", "Work Certification"],
  labour: ["Worker Onboarding", "Attendance", "Shifts", "Wages", "Overtime", "Productivity"],
  machinery: ["Equipment Allocation", "Fuel Tracking", "Maintenance", "Breakdowns", "Utilization", "Spare Parts"],
  quality: ["Inspection Requests", "Checklists", "NCR", "Test Reports", "Cube Tracking", "Snagging"],
  safety: ["Permits", "Incidents", "PPE", "Toolbox Talks", "Risk Assessment", "Compliance"],
  finance: ["General Ledger", "Accounts Payable", "Accounts Receivable", "GST", "TDS", "Bank Reconciliation"],
  hrms: ["Employees", "Leave", "Payroll", "Recruitment", "Reimbursements", "Assets"],
  documents: ["Drawings", "Contracts", "OCR Search", "Version Control", "Digital Signatures", "Approvals"],
  customer: ["Booking Status", "Payments", "Construction Updates", "Complaints", "Service Requests", "Documents"],
  facility: ["Asset Lifecycle", "Preventive Maintenance", "Warranty", "AMC", "Facility Requests", "Renewals"],
  analytics: ["Executive KPIs", "Profitability", "Cashflow", "Delay Analytics", "Resource Utilization", "AI Insights"],
  workflow: ["Builder", "Triggers", "Approvals", "SLA", "Escalations", "Action Logs"],
  mobile: ["Management App", "Site Engineer App", "Attendance App", "Vendor App", "Customer App", "Offline Sync"],
  ai: ["Chatbot", "Voice Commands", "OCR", "Forecasting", "Anomaly Detection", "Report Generator"]
};

const submodulePages = modules.flatMap((module) =>
  (submenuLabels[module.screen] ?? []).map((label, index) => {
    const slug = `${module.screen}-${slugify(label)}`;
    return {
      ...module,
      screen: slug,
      parentScreen: module.screen,
      title: `${module.title} - ${label}`,
      subtitle: `${label} screen for ${module.title}. Includes approvals, automation, audit trail, mobile workflow, and AI assistance for this construction process.`,
      action: getSubmenuAction(label),
      stats: module.stats.map((stat, statIndex) => ({
        ...stat,
        label: statIndex === 0 ? `${label} records` : stat.label
      })),
      automations: [
        `Auto ${label.toLowerCase()} routing`,
        `${label} AI validation`,
        "Digital approval tracking",
        "Audit log capture"
      ],
      workflows: [
        `${label} created`,
        "Validated",
        "Approval routed",
        "Posted to linked module",
        "Audit archived"
      ],
      rows: module.rows.map((row, rowIndex) => {
        const genericNames = ["Alpha", "Beta", "Gamma", "Delta", "Omega"];
        const people = ["Rahul Sharma", "Priya Desai", "Amit Kumar", "Sneha Rao", "Vikram Singh"];
        const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];
        let primaryLabel = `${label} - ${row.primary}`;
        let secondaryLabel = row.secondary;
        let ownerLabel = row.owner;

        if (label === "Users" || label === "Employees" || label === "Worker Onboarding") {
          primaryLabel = people[rowIndex % people.length] ?? "User";
          secondaryLabel = "System User";
          ownerLabel = "HR";
        } else if (label === "Branches" || label === "Companies") {
          primaryLabel = `${cities[rowIndex % cities.length] ?? "City"} Office`;
          secondaryLabel = "Regional HQ";
          ownerLabel = "Admin";
        } else if (label.includes("Approval") || label.includes("Requests")) {
          primaryLabel = `${label} #${100 + rowIndex}`;
          secondaryLabel = "Pending Review";
          ownerLabel = "System";
        } else if (label === "Roles") {
          primaryLabel = `${genericNames[rowIndex % genericNames.length] ?? "Generic"} Role`;
          secondaryLabel = "System Access";
          ownerLabel = "IT";
        } else {
          primaryLabel = `${label} for ${row.primary}`;
        }

        return {
          ...row,
          id: `${slug.slice(0, 3).toUpperCase()}-${index + 1}${rowIndex + 1}${row.id.slice(-2)}`,
          primary: primaryLabel,
          secondary: secondaryLabel,
          owner: ownerLabel,
          status: rowIndex === 0 ? "Active" : row.status
        };
      })
    } satisfies ModulePage;
  })
);

const allScreens = [...modules, ...submodulePages];
const allScreenByKey = Object.fromEntries(allScreens.map((module) => [module.screen, module])) as Record<string, ModulePage>;

const routeToScreen: Record<string, string> = {
  "Organization and admin": "admin",
  "CRM and sales": "crm",
  "Tendering and estimation": "tendering",
  Projects: "projects",
  Procurement: "procurement",
  Inventory: "inventory",
  Contractors: "contractors",
  Labour: "labour",
  "Plant and machinery": "machinery",
  "QA/QC": "quality",
  "Safety EHS": "safety",
  "Finance and GST": "finance",
  "Payroll and HRMS": "hrms",
  "Document management": "documents",
  "Customer portal": "customer",
  "Asset and facility": "facility",
  "BI and analytics": "analytics",
  "Workflow automation": "workflow",
  "Mobile apps": "mobile",
  "AI automation": "ai",
  admin: "admin",
  crm: "crm",
  tendering: "tendering",
  projects: "projects",
  procurement: "procurement",
  inventory: "inventory",
  contractors: "contractors",
  labour: "labour",
  machinery: "machinery",
  quality: "quality",
  safety: "safety",
  finance: "finance",
  hrms: "hrms",
  documents: "documents",
  customer: "customer",
  facility: "facility",
  analytics: "analytics",
  workflow: "workflow",
  mobile: "mobile",
  ai: "ai",
  "Tendering and estimation/Tenders": "tendering",
  "Projects/Overview": "projects",
  "Contractors/QS Billing": "contractors",
  "Contractors/RA bills": "contractors",
  "Finance and GST/Payments": "finance",
  "Procurement/Purchase Orders": "procurement",
  "Procurement/Rate Contracts": "procurement",
  "Procurement/Vendor Management": "procurement",
  "Inventory/Stock": "inventory",
  "Inventory/GRN": "inventory",
  "Inventory/Material Requests": "inventory",
  "Payroll and HRMS/PF Compliance": "hrms",
  "Safety EHS/Permits": "safety",
  "QA/QC/Inspections": "quality",
  "BI and analytics/Executive": "analytics",
  "Document management/OCR": "documents",
  "Organization and admin/Users": "admin",
  "CRM and sales/Leads": "crm",
  "Labour/Attendance": "labour",
  "Plant and machinery/Fleet": "machinery",
  "Customer portal/Service Requests": "customer",
  "Asset and facility/Work Orders": "facility",
  "Workflow automation/Builder": "workflow",
  "Mobile apps/Offline Sync": "mobile",
  "AI automation/Agents": "ai"
};

const spend = [
  { month: "Dec", value: 42 },
  { month: "Jan", value: 58 },
  { month: "Feb", value: 44 },
  { month: "Mar", value: 72 },
  { month: "Apr", value: 68 },
  { month: "May", value: 81 }
];

const billing = [
  { name: "Metro Rail", value: 38 },
  { name: "Highway", value: 24 },
  { name: "Commercial", value: 21 },
  { name: "Residential", value: 17 }
];

const boardKeywords = ["WBS", "Gantt", "Milestones", "RFQ", "Comparative", "Builder", "Triggers", "Approvals", "SLA", "Escalations", "Management App", "Site Engineer App", "Attendance App", "Vendor App", "Customer App", "Offline Sync"];
const formKeywords = ["Material Requisition", "BOQ", "Rate Analysis", "Leads", "Site Visits", "Bookings", "Quotations", "Worker Onboarding", "Employees", "Leave", "Payroll", "Recruitment", "Reimbursements", "Voice Commands"];
const ledgerKeywords = ["Purchase Orders", "GRN", "Stock", "Material Issue", "Stock Transfer", "Gate Pass", "Scrap", "General Ledger", "Accounts Payable", "Accounts Receivable", "GST", "TDS", "Bank Reconciliation", "Work Orders", "RA Bills", "Retention", "Contractor Ledger", "Payments"];
const inspectionKeywords = ["DPR", "Delay Tracking", "Resources", "Inspection", "Checklists", "NCR", "Test Reports", "Cube Tracking", "Snagging", "Permits", "Incidents", "PPE", "Toolbox", "Risk Assessment", "Compliance", "Maintenance", "Breakdowns", "Utilization"];
const documentKeywords = ["Drawings", "Contracts", "OCR Search", "Version Control", "Digital Signatures", "Documents", "Report Generator"];
const analyticsKeywords = ["Executive KPIs", "Profitability", "Cashflow", "Delay Analytics", "Resource Utilization", "AI Insights", "Chatbot", "OCR", "Forecasting", "Anomaly Detection"];

function getScreenKind(page: ModulePage) {
  const label = page.title;
  if (!page.parentScreen) return "overview";
  if (boardKeywords.some((keyword) => label.includes(keyword))) return "board";
  if (formKeywords.some((keyword) => label.includes(keyword))) return "form";
  if (ledgerKeywords.some((keyword) => label.includes(keyword))) return "ledger";
  if (inspectionKeywords.some((keyword) => label.includes(keyword))) return "inspection";
  if (documentKeywords.some((keyword) => label.includes(keyword))) return "documents";
  if (analyticsKeywords.some((keyword) => label.includes(keyword))) return "analytics";
  return "workbench";
}

function getApiRowsForPage(page: ModulePage, apiState: ApiState): Row[] {
  const parent = page.parentScreen ?? page.screen;

  if (parent === "projects" && apiState.dashboard?.projects?.length) {
    return apiState.dashboard.projects.map((project, index) => ({
      id: String(project.id ?? `PRJ-${index + 1}`),
      owner: "PMO",
      primary: String(project.name ?? "Project"),
      secondary: String(project.city ?? project.type ?? "Site"),
      status: String(project.status ?? "Live"),
      value: `${project.progress ?? 0}%`
    }));
  }

  if (parent === "procurement" && apiState.procurement) {
    const list = Array.isArray(apiState.procurement) ? apiState.procurement : (apiState.procurement.recentPos || []);
    return list.map((item: any, index: number) => ({
      id: String(item.id ?? `MAT-${index + 1}`),
      owner: "Procurement",
      primary: String(item.item ?? item.primary ?? "Material"),
      secondary: String(item.vendorRecommendation ?? item.secondary ?? "Vendor recommendation"),
      status: String(item.nextAction ?? item.status ?? "Pending"),
      value: String(item.requiredQty ?? item.value ?? "-")
    }));
  }

  if (parent === "inventory" && apiState.inventory?.length) {
    return apiState.inventory.map((item, index) => ({
      id: String(item.id ?? `INV-${index + 1}`),
      owner: String(item.warehouse ?? "Stores"),
      primary: String(item.material ?? "Material"),
      secondary: String(item.sku ?? "SKU"),
      status: String(item.status ?? "ok"),
      value: String(item.onHand ?? "-")
    }));
  }

  if (parent === "finance" && apiState.finance) {
    return [
      { id: "FIN-CASH", owner: "Treasury", primary: "Cashflow runway", secondary: "Forecast", status: "Live", value: `${apiState.finance.cashflowDays ?? 0} days` },
      { id: "FIN-GST", owner: "Tax Team", primary: "GST liability", secondary: "Current period", status: "Review", value: `Rs ${apiState.finance.gstLiabilityCr ?? 0}Cr` },
      { id: "FIN-AP", owner: "AP Team", primary: "Vendor dues", secondary: "Outstanding", status: "Pending", value: `Rs ${apiState.finance.vendorDuesCr ?? 0}Cr` }
    ];
  }

  if (parent === "documents" && apiState.documents?.length) {
    return apiState.documents.map((doc, index) => ({
      id: String(doc.id ?? `DOC-${index + 1}`),
      owner: "Document Control",
      primary: String(doc.name ?? "Document"),
      secondary: String(doc.type ?? "Folder"),
      status: String(doc.approvalStatus ?? "pending"),
      value: String(doc.version ?? "1")
    }));
  }

  if (parent === "workflow" && apiState.workflows?.length) {
    return apiState.workflows.map((workflow, index) => ({
      id: String(workflow.id ?? `WF-${index + 1}`),
      owner: "Automation",
      primary: String(workflow.name ?? "Workflow"),
      secondary: String(workflow.trigger ?? "Trigger"),
      status: workflow.enabled ? "Live" : "Draft",
      value: Array.isArray(workflow.actions) ? `${workflow.actions.length} actions` : "Active"
    }));
  }

  return page.rows;
}

function recordModuleAction(page: ModulePage, action: string, message: string) {
  apiPost(`/tenants/${DEFAULT_TENANT_ID}/module-actions`, {
    action,
    message,
    module: page.parentScreen ?? page.screen,
    submenu: page.title
  }).catch(() => undefined);
}

function canAccessModule(module: ModulePage, apiState: ApiState) {
  if (!apiState.connected) return true;
  const permissions = apiState.user?.permissions ?? [];
  return permissions.includes(module.permission) || permissions.includes("*");
}

function canMutateModule(module: ModulePage, apiState: ApiState) {
  if (!apiState.connected) return true;
  const permissions = apiState.user?.permissions ?? [];
  return permissions.includes(module.permission) || permissions.includes("admin.manage") || permissions.includes("*");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getSubmenuAction(label: string) {
  if (label.includes("Report") || label.includes("Analytics")) return "Generate Report";
  if (label.includes("Approval")) return "Route Approval";
  if (label.includes("Payment")) return "Record Payment";
  if (label.includes("Search")) return "Search Documents";
  return `Create ${label}`;
}

export function PremiumErpShell({ initialScreen = null }: { initialScreen?: string | null }) {
  const [screen, setScreen] = useState<string | null>(initialScreen);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiState, setApiState] = useState<ApiState>({ connected: false, loading: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const activeModule = screen ? allScreenByKey[screen] : null;
  const isDashboard = !activeModule;
  const allowedModules = useMemo(() => modules.filter((module) => canAccessModule(module, apiState)), [apiState]);

  useEffect(() => {
    setCollapsed(localStorage.getItem("bcim-sidebar-collapsed") === "true");
    const syncScreenFromUrl = () => {
      const urlScreen = window.location.hash.startsWith("#screen=") ? window.location.hash.replace("#screen=", "") : new URLSearchParams(window.location.search).get("screen");
      const targetScreen = initialScreen ?? urlScreen;
      setScreen(targetScreen);
      if (targetScreen && targetScreen !== "dashboard") {
        setOpenTabs((prev) => prev.includes(targetScreen) ? prev : [...prev, targetScreen]);
      }
    };

    syncScreenFromUrl();
    window.addEventListener("hashchange", syncScreenFromUrl);
    return () => window.removeEventListener("hashchange", syncScreenFromUrl);
  }, [initialScreen]);

  const handleSetScreen = useCallback((newScreen: string | null) => {
    setScreen(newScreen);
    if (newScreen && newScreen !== "dashboard") {
      setOpenTabs((prev) => prev.includes(newScreen) ? prev : [...prev, newScreen]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadApiData() {
      try {
        const health = await apiGet<ApiState["health"]>(`/health`);
        const [me, dashboard, procurement, inventory, finance, documents, workflows, insights, gstrStatus] = await Promise.all([
          apiGet<{ name?: string; permissions?: string[]; role?: string }>(`/auth/me`),
          apiGet<ApiState["dashboard"]>(`/tenants/${DEFAULT_TENANT_ID}/dashboard/erp-home`),
          apiGet<ApiState["procurement"]>(`/tenants/${DEFAULT_TENANT_ID}/procurement`),
          apiGet<ApiState["inventory"]>(`/tenants/${DEFAULT_TENANT_ID}/inventory`),
          apiGet<ApiState["finance"]>(`/tenants/${DEFAULT_TENANT_ID}/finance/summary`),
          apiGet<ApiState["documents"]>(`/tenants/${DEFAULT_TENANT_ID}/documents`),
          apiGet<ApiState["workflows"]>(`/tenants/${DEFAULT_TENANT_ID}/workflows`),
          aiInsights(DEFAULT_TENANT_ID).catch(() => [] as AiInsight[]),
          getGstrStatus(DEFAULT_TENANT_ID).catch(() => undefined)
        ]);

        if (!cancelled) {
          setApiState({ connected: true, dashboard, documents, finance, health, inventory, loading: false, procurement, user: { name: me.name ?? "User", permissions: me.permissions ?? [], role: me.role ?? "User" }, workflows, aiInsights: insights, gstrStatus });
        }
      } catch {
        const health = await apiGet<ApiState["health"]>(`/health`).catch(() => undefined);
        const insights = await aiInsights(DEFAULT_TENANT_ID).catch(() => [] as AiInsight[]);
        if (!cancelled) setApiState({ connected: false, health, loading: false, aiInsights: insights });
      }
    }

    loadApiData();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleModules = allowedModules.length ? allowedModules : modules;
  const criticalInsights = (apiState.aiInsights ?? []).filter(i => i.actionRequired).length;

  // global search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return allScreens
      .filter(m => m.title.toLowerCase().includes(q) || m.subtitle.toLowerCase().includes(q) || m.group.toLowerCase().includes(q))
      .slice(0, 8);
  }, [searchQuery]);

  function toggle() {
    setCollapsed((current) => {
      localStorage.setItem("bcim-sidebar-collapsed", String(!current));
      return !current;
    });
  }

  if (!apiState.loading && !apiState.connected) {
    return <LoginPanel />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#eef3f8] font-sans text-textPrimary">
      {/* mobile sidebar overlay */}
      {mobileOpen ? <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} /> : null}

      {/* SIDEBAR */}
      <aside className={`${collapsed ? "lg:w-[72px]" : "lg:w-[286px]"} fixed inset-y-0 left-0 z-40 flex h-screen w-[286px] flex-col bg-[#3B5295] text-white shadow-2xl transition-all duration-300 lg:static ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3B5295] font-bold text-white">NC</div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-5">NirmaanCloud</p>
              <p className="text-xs text-white/60">Construction ERP Suite</p>
            </div>
          ) : null}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              {!collapsed ? <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-white/45">{group.label}</p> : null}
              <div className="space-y-1">
                {group.screens.map((navScreen) => {
                  if (navScreen === "dashboard") {
                    return <SidebarItem active={isDashboard} collapsed={collapsed} icon={Home} key={navScreen} label="Executive Cockpit" path="/" screen={null} setScreen={(nextScreen) => { setScreen(nextScreen); setMobileOpen(false); }} />;
                  }
                  const module = moduleByScreen[navScreen];
                  if (!canAccessModule(module, apiState)) return null;
                  return (
                    <div key={module.screen}>
                    <SidebarItem
                      active={screen === module.screen}
                      collapsed={collapsed}
                      icon={module.icon}
                      label={module.title}
                      path={`/#screen=${module.screen}`}
                      screen={module.screen}
                      setScreen={(nextScreen) => { handleSetScreen(nextScreen); setMobileOpen(false); }}
                    />
                    {!collapsed ? (() => {
                      const isActiveParent = screen === module.screen || (typeof screen === 'string' && screen.startsWith(module.screen + '-'));
                      const subLabels = submenuLabels[module.screen] ?? [];
                      if (subLabels.length === 0) return null;
                      return (
                        <div
                          className="ml-8 border-l border-white/10 pl-2 overflow-hidden transition-all duration-300"
                          style={{ maxHeight: isActiveParent ? `${subLabels.length * 36}px` : '0px', opacity: isActiveParent ? 1 : 0, marginTop: isActiveParent ? '4px' : '0px' }}
                        >
                          <div className="space-y-1">
                            {subLabels.map((label) => {
                              const submenuScreen = `${module.screen}-${slugify(label)}`;
                              return (
                                <SidebarItem
                                  active={screen === submenuScreen}
                                  collapsed={false}
                                  compact
                                  icon={ChevronRight}
                                  key={submenuScreen}
                                  label={label}
                                  path={`/#screen=${submenuScreen}`}
                                  screen={submenuScreen}
                                  setScreen={(nextScreen) => { handleSetScreen(nextScreen); setMobileOpen(false); }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })() : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <button className="m-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10" onClick={toggle}>
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> Collapse</>}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ── ENHANCED HEADER ── */}
        <header className="relative flex h-16 items-center justify-between border-b border-[#d7e1ec] bg-white px-4 shadow-sm md:px-6">
          {/* Left: hamburger + breadcrumb */}
          <div className="flex min-w-0 items-center gap-3 text-sm font-medium text-gray-500">
            <button className="rounded-lg border border-border p-2 text-primary lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu size={18} />
            </button>
            <span className="truncate font-semibold text-[#3B5295]">{isDashboard ? "Executive Cockpit" : `${activeModule.group} › ${activeModule.title}`}</span>
            <span className={`hidden rounded-full px-2 py-1 text-xs font-semibold md:inline ${apiState.connected ? "bg-[#eef3f8] text-[#30447c]" : "bg-amber-50 text-warning"}`}>
              {apiState.loading ? "Checking API…" : apiState.connected ? "● API Live" : "â—Œ Demo Mode"}
            </span>
          </div>

          {/* Centre: Global Search */}
          <div className="relative mx-4 hidden max-w-md flex-1 md:block" ref={searchRef}>
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-all focus-within:border-[#3B5295] focus-within:bg-white focus-within:shadow-md">
              <Search className="mr-2 shrink-0 text-gray-400" size={16} />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                placeholder="Search modules, POs, projects, vendors…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
              />
              {searchQuery ? <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600"><X size={14} /></button> : null}
            </div>
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[#d7e1ec] bg-white shadow-2xl">
                {searchResults.map(result => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.screen}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#eef3f8]"
                      onMouseDown={() => {
                        setScreen(result.screen);
                        window.location.hash = `screen=${result.screen}`;
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: result.accent }}>
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#3B5295]">{result.title}</p>
                        <p className="truncate text-xs text-gray-500">{result.group}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: notifications + profile */}
          <div className="flex items-center gap-2">
            <button 
              className="hidden rounded-lg bg-[#3B5295] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#30447c] md:block shadow-sm" 
              onClick={() => {
                if (screen?.startsWith("procurement-vendor")) {
                  setScreen("procurement-vendor-portal");
                } else if (screen?.startsWith("procurement")) {
                  setScreen("procurement-material-requisition");
                } else {
                  setScreen("procurement-material-requisition");
                }
              }}
            >
              Create New
            </button>

            {/* Notifications */}
            <div className="relative ml-2">
              <button
                id="btn-notifications"
                className="relative rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#3B5295]"
                onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {criticalInsights > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white ring-2 ring-white">
                    {criticalInsights > 9 ? "9+" : criticalInsights}
                  </span>
                )}
              </button>
              {notifOpen && (
                <NotificationsPanel insights={apiState.aiInsights ?? []} onClose={() => setNotifOpen(false)} setScreen={setScreen} />
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                id="btn-profile"
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-100"
                onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1B3A6B] to-[#3B5295] text-xs font-bold text-white">
                  {apiState.user?.name?.slice(0, 2).toUpperCase() ?? "BC"}
                </span>
                <span className="hidden text-left text-xs md:block">
                  <b className="block text-gray-800">{apiState.user?.name ?? "Demo User"}</b>
                  <span className="text-gray-500">{apiState.user?.role ?? "Guest"}</span>
                </span>
                <ChevronDown size={14} className="hidden text-gray-400 md:block" />
              </button>
              {profileOpen && (
                <ProfileDropdown apiState={apiState} onClose={() => setProfileOpen(false)} />
              )}
            </div>
          </div>
        </header>

          <WorkspaceTabs
            activeScreen={activeModule?.screen ?? null}
            openTabs={openTabs}
            setOpenTabs={setOpenTabs}
            setScreen={handleSetScreen}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-5 bg-[#f4f7f9] pb-24 md:pb-4 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={screen ?? "dashboard"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {apiState.loading ? (
                  <SkeletonDashboard />
                ) : isDashboard ? (
                  <PremiumDashboard apiState={apiState} modules={visibleModules} setScreen={handleSetScreen} />
                ) : (
                  <PremiumModulePage apiState={apiState} page={activeModule} setScreen={handleSetScreen} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <MobileBottomNav setScreen={handleSetScreen} activeScreen={screen} setMobileOpen={setMobileOpen} />
      </div>
  );
}

function MobileBottomNav({ setScreen, activeScreen, setMobileOpen }: { setScreen: (s: string | null) => void, activeScreen: string | null, setMobileOpen: (b: boolean) => void }) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-around border-t border-[#d7e1ec] bg-white px-2 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] fixed bottom-0 left-0 right-0 z-50">
      <button onClick={() => { setScreen(null); window.location.hash = ""; }} className={`flex flex-col items-center gap-1 p-2 text-[10px] font-medium ${!activeScreen || activeScreen === "dashboard" ? "text-[#3B5295]" : "text-gray-500"}`}>
        <Home size={20} /> Home
      </button>
      <button onClick={() => { setScreen("projects"); window.location.hash = "screen=projects"; }} className={`flex flex-col items-center gap-1 p-2 text-[10px] font-medium ${activeScreen === "projects" ? "text-[#3B5295]" : "text-gray-500"}`}>
        <Building2 size={20} /> Projects
      </button>
      <div className="relative -top-5">
        <button onClick={() => { setScreen("inventory-gate-pass"); window.location.hash = "screen=inventory-gate-pass"; }} className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#1B3A6B] to-[#3B5295] text-white shadow-lg shadow-teal-500/30 active:scale-95 transition-transform">
          <ScanLine size={24} />
        </button>
      </div>
      <button onClick={() => { setScreen("quality-checklists"); window.location.hash = "screen=quality-checklists"; }} className={`flex flex-col items-center gap-1 p-2 text-[10px] font-medium ${activeScreen === "quality-checklists" ? "text-[#3B5295]" : "text-gray-500"}`}>
        <ClipboardCheck size={20} /> QA/QC
      </button>
      <button onClick={() => setMobileOpen(true)} className="flex flex-col items-center gap-1 p-2 text-[10px] font-medium text-gray-500">
        <Menu size={20} /> Menu
      </button>
    </div>
  );
}

function WorkspaceTabs({
  activeScreen,
  openTabs,
  setOpenTabs,
  setScreen
}: {
  activeScreen: string | null;
  openTabs: string[];
  setOpenTabs: (tabs: string[]) => void;
  setScreen: (screen: string | null) => void;
}) {
  if (openTabs.length === 0) return null;

  return (
    <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-[#d7e1ec] bg-[#eef3f8] px-3 pt-2">
      <button
        className={`mb-[-1px] flex shrink-0 items-center gap-2 rounded-t-lg border-x border-t px-4 py-2.5 text-xs font-semibold transition-colors ${!activeScreen || activeScreen === "dashboard" ? "border-[#d7e1ec] bg-white text-[#3B5295] shadow-[0_-2px_0_#1B3A6B_inset]" : "border-transparent text-gray-500 hover:bg-gray-100/50"}`}
        onClick={() => {
          setScreen(null);
          window.location.hash = "";
        }}
      >
        <Home size={14} /> Home
      </button>

      {openTabs.map((tab) => {
        const module = allScreenByKey[tab];
        if (!module) return null;
        const Icon = module.icon;
        const isActive = activeScreen === tab;

        return (
          <div
            key={tab}
            className={`group relative mb-[-1px] flex shrink-0 cursor-pointer items-center gap-2 rounded-t-lg border-x border-t px-3 py-2 text-xs font-semibold transition-colors ${isActive ? "border-[#d7e1ec] bg-white text-[#3B5295] shadow-[0_-2px_0_#3B5295_inset]" : "border-transparent text-gray-500 hover:bg-gray-100/50"}`}
            onClick={() => {
              setScreen(tab);
              window.location.hash = `screen=${tab}`;
            }}
          >
            <Icon size={14} className={isActive ? "text-[#3B5295]" : "text-gray-400"} />
            <span className="truncate max-w-[160px]">{module.title.replace(" & ", " / ")}</span>
            <button
              className={`ml-1 rounded-sm p-0.5 opacity-0 transition-opacity group-hover:opacity-100 ${isActive ? "opacity-100 hover:bg-gray-100" : "hover:bg-gray-200"}`}
              onClick={(e) => {
                e.stopPropagation();
                const newTabs = openTabs.filter((t) => t !== tab);
                setOpenTabs(newTabs);
                if (isActive) {
                  const prevTab = newTabs[newTabs.length - 1];
                  if (prevTab) {
                    setScreen(prevTab);
                    window.location.hash = `screen=${prevTab}`;
                  } else {
                    setScreen(null);
                    window.location.hash = "";
                  }
                }
              }}
            >
              <X size={12} className={isActive ? "text-gray-500" : "text-gray-400"} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function SidebarItem({
  active,
  collapsed,
  icon: Icon,
  label,
  openInNewWindow = false,
  path,
  screen,
  setScreen,
  compact = false
}: {
  active: boolean;
  collapsed: boolean;
  compact?: boolean;
  icon: LucideIcon;
  label: string;
  openInNewWindow?: boolean;
  path: string;
  screen: string | null;
  setScreen: (screen: string | null) => void;
}) {
  return (
    <button
      className={`group relative flex w-full items-center gap-3 rounded-lg text-left transition-colors ${compact ? "py-1.5 text-xs" : "py-2.5 text-sm"} ${collapsed ? "justify-center px-0" : "px-3"} ${active ? "border-l-4 border-[#3B5295] bg-[#24466f] text-[#7ee2d8]" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
      onClick={() => {
        if (openInNewWindow) {
          window.open(path, "_blank", "noopener,noreferrer");
          return;
        }
        if (screen) {
          window.location.hash = `screen=${screen}`;
        } else {
          window.history.pushState(null, "", "/");
        }
        setScreen(screen);
      }}
      title={collapsed ? label : undefined}
      type="button"
    >
      <Icon size={18} />
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </button>
  );
}

export function screenFromModuleRoute(module: string, submenu?: string) {
  return routeToScreen[submenu ? `${module}/${submenu}` : module] ?? null;
}


function PremiumDashboard({ apiState, modules, setScreen }: { apiState: ApiState; modules: ModulePage[]; setScreen: (screen: string) => void }) {
  const hasData = (apiState.health?.counts?.projects ?? 0) > 0;

  const cashflowData = hasData ? [
    { name: 'Feb', debit: 14.05, credit: 21.07 },
    { name: 'Mar', debit: 21.07, credit: 28.10 },
    { name: 'Apr', debit: 18.5, credit: 25.10 },
    { name: 'May', debit: 25.1, credit: 32.5 },
    { name: 'Jun', debit: 20.2, credit: 28.1 },
    { name: 'Jul', debit: 28.1, credit: 35.12 },
    { name: 'Aug', debit: 35.12, credit: 42.0 },
  ] : [
    { name: 'Feb', debit: 0, credit: 0 },
    { name: 'Mar', debit: 0, credit: 0 },
    { name: 'Apr', debit: 0, credit: 0 },
    { name: 'May', debit: 0, credit: 0 },
    { name: 'Jun', debit: 0, credit: 0 },
    { name: 'Jul', debit: 0, credit: 0 },
    { name: 'Aug', debit: 0, credit: 0 },
  ];
  
  const finance = apiState.finance || {};
  const bankAccounts = hasData && finance.bankBalanceCr ? [
    { name: "Main Operating Account", amount: `Rs ${Number(finance.bankBalanceCr).toFixed(2)}Cr`, isPositive: Number(finance.bankBalanceCr) > 0 },
    { name: "Project Escrow", amount: "Rs 0.00Cr", isPositive: true },
    { name: "Tax Reserve", amount: `Rs (${Number(finance.gstLiabilityCr || 0).toFixed(2)}Cr)`, isPositive: false }
  ] : [
    { name: "HDFC Bank (Operating)", amount: "Rs 0.00Cr", isPositive: true },
    { name: "State Bank of India", amount: "Rs 0.00Cr", isPositive: true },
    { name: "Axis Bank", amount: "Rs 0.00Cr", isPositive: true }
  ];

  const upcomingInvoices = hasData && finance.arOutstandingCr ? [
    { name: 'Paid', value: finance.revenueThisMonthCr || 0, fill: '#10b981' },
    { name: 'Outstanding', value: finance.arOutstandingCr || 0, fill: '#ff4d4f' },
    { name: 'Due Soon', value: finance.apOutstandingCr || 0, fill: '#faad14' },
    { name: 'Draft', value: 0, fill: '#3B5295' }
  ] : [
    { name: 'Paid', value: 1, fill: '#f1f5f9' }
  ];

  const totalInvoiceValue = hasData && finance.arOutstandingCr ? `Rs ${(Number(finance.arOutstandingCr) + Number(finance.revenueThisMonthCr || 0)).toFixed(2)}Cr` : "Rs 0.00Cr";

  const pnlData = hasData ? [
    { name: 'Jan', value: 6.6 },
    { name: 'Feb', value: 13.2 },
    { name: 'Mar', value: 19.8 },
    { name: 'Apr', value: 26.4 },
    { name: 'May', value: 33.0 },
    { name: 'Jun', value: 26.4 },
    { name: 'Jul', value: 19.8 },
    { name: 'Aug', value: 22.1 },
    { name: 'Sep', value: 15.0 },
    { name: 'Oct', value: 18.4 },
    { name: 'Nov', value: 29.5 },
    { name: 'Dec', value: 38.2 }
  ] : [
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-[#3B5295]">Project Executive Dashboard</h1>
      </div>

      {/* TOP ROW: 3 Cards */}
      <section className="grid gap-4 xl:grid-cols-3">
        {/* Cashflow Card */}
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3, delay:0.1}} className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#3B5295]">Project Cashflow</h2>
            <span className="text-xs text-gray-500 cursor-pointer">Last 6 months <ChevronDown size={14} className="inline"/></span>
          </div>
          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B5295" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B5295" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} tickFormatter={(v) => `Rs${v}Cr`} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="credit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCredit)" />
                <Area type="monotone" dataKey="debit" stroke="#3B5295" strokeWidth={2} fillOpacity={1} fill="url(#colorDebit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bank Account Card */}
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3, delay:0.2}} className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm flex flex-col">
          <h2 className="text-base font-bold text-[#3B5295] mb-4">Bank Balances</h2>
          <div className="flex-1 space-y-3">
            {bankAccounts.map(bank => (
              <div key={bank.name} className="flex justify-between items-center text-xs font-semibold py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{bank.name}</span>
                <span className={bank.isPositive ? "text-[#3B5295]" : "text-red-500"}>{bank.amount}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs font-semibold border border-gray-200 rounded-md px-4 py-2 self-start text-gray-600 hover:bg-gray-50 transition-colors">View All Accounts</button>
        </motion.div>

        {/* Upcoming Invoices Card */}
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3, delay:0.3}} className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-[#3B5295] mb-4">Upcoming Invoices</h2>
          <div className="flex items-center h-48">
            <div className="flex-1 space-y-4">
               {upcomingInvoices.map(inv => (
                 <div key={inv.name} className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{backgroundColor: inv.fill}}></span> <span className="text-gray-600 font-medium">{inv.name}</span></div>
                   <span className="font-bold text-[#3B5295]">Rs {inv.value.toLocaleString()}Cr</span>
                 </div>
               ))}
            </div>
            <div className="w-[140px] h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={upcomingInvoices} innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                    {upcomingInvoices.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Total</span>
                <span className="text-xs font-bold text-[#3B5295]">{totalInvoiceValue}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MIDDLE ROW: Sales Invoices */}
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3, delay:0.4}} className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#3B5295]">Client Billing Status</h2>
            <span className="text-xs text-gray-500 cursor-pointer">Last 30 days <ChevronDown size={14} className="inline"/></span>
          </div>
          <div className="flex justify-between text-sm font-semibold mb-3">
            <span className="text-[#3B5295]">{hasData ? "Rs 10.07Cr Paid" : "Rs 0.00Cr Paid"}</span>
            <span className="text-gray-500">{hasData ? "Rs 10.91Cr Unpaid" : "Rs 0.00Cr Unpaid"}</span>
          </div>
          <div className="w-full h-8 flex rounded-md overflow-hidden bg-gray-100">
            <div className={`bg-[#3B5295] h-full transition-all duration-1000 ${!hasData && 'opacity-0'}`} style={{width: hasData ? '45%' : '0%'}}></div>
            <div className={`bg-[#b3c7f9] h-full transition-all duration-1000 ${!hasData && 'opacity-0'}`} style={{width: hasData ? '55%' : '0%'}}></div>
          </div>
          <div className="flex items-center gap-6 mt-4 text-xs font-semibold">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3B5295]"></span> <span className="text-gray-600">Paid {hasData ? "Rs 10.07Cr" : "Rs 0.00Cr"}</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#b3c7f9]"></span> <span className="text-gray-600">Unpaid {hasData ? "Rs 10.91Cr" : "Rs 0.00Cr"}</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> <span className="text-red-600">Over Due {hasData ? "Rs 3.11Cr" : "Rs 0.00Cr"}</span></div>
          </div>
      </motion.div>

      {/* BOTTOM ROW: P&L and Modules */}
      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3, delay:0.5}} className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#3B5295]">Monthly Profit & Loss</h2>
            <span className="text-xs text-gray-500 cursor-pointer">Current Year <ChevronDown size={14} className="inline"/></span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnlData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} tickFormatter={(v) => `Rs${v}Cr`} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#3B5295" radius={[4,4,0,0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3, delay:0.6}} className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-[#3B5295] mb-6">Quick Launch Modules</h2>
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            {modules.slice(0, 12).map((m) => {
              const Icon = m.icon;
              return (
                <button key={m.screen} onClick={() => setScreen(m.screen)} className="flex flex-col items-center justify-center gap-2 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#eef3f8] text-[#3B5295] flex items-center justify-center group-hover:bg-[#3B5295] group-hover:text-white transition-all shadow-sm group-hover:shadow-md">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-semibold text-center text-gray-600 group-hover:text-[#3B5295] leading-tight px-1">{m.title.replace(" & ", "\n")}</span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}

function ChartPanel() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#3B5295]">Procurement Spend vs Budget</h2>
      <div className="mt-4 h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={spend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "#f1f5f9" }}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Bar dataKey="value" fill="#1B3A6B" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="mt-6 text-lg font-semibold text-[#3B5295]">Billing by Vertical</h2>
      <div className="mt-2 flex h-[160px] w-full items-center">
        <div className="h-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={billing}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {billing.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#1B3A6B", "#C9A84C", "#2B6CB0", "#2F855A"][index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                itemStyle={{ color: "#3B5295", fontWeight: "bold" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {billing.map((item, index) => (
            <div className="flex items-center justify-between text-xs font-medium" key={item.name}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ["#1B3A6B", "#C9A84C", "#2B6CB0", "#2F855A"][index] }} />
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel({ insights, onClose, setScreen }: { insights: AiInsight[]; onClose: () => void; setScreen: (s: string) => void }) {
  const critical = insights.filter(i => i.severity === "critical");
  const warnings = insights.filter(i => i.severity === "warning");
  const infos = insights.filter(i => i.severity === "info");

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[380px] origin-top-right overflow-hidden rounded-xl border border-[#d7e1ec] bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <div>
          <h3 className="font-bold text-[#3B5295]">Notifications & Alerts</h3>
          <p className="text-xs text-gray-500">AI-generated risk & compliance alerts</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-2">
        {insights.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No alerts at this time.</div>
        ) : (
          <>
            {[
              { list: critical, icon: AlertTriangle, bg: "bg-red-50", text: "text-red-700", border: "border-red-100" },
              { list: warnings, icon: AlertTriangle, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
              { list: infos, icon: Bell, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" }
            ].map(({ list, icon: Icon, bg, text, border }) => (
              list.map(insight => (
                <div key={insight.id} className={`mb-2 rounded-lg border ${border} ${bg} p-3 transition-colors hover:border-gray-300`}>
                  <div className="flex gap-3">
                    <div className={`mt-0.5 shrink-0 ${text}`}><Icon size={16} /></div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${text}`}>{insight.domain}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{insight.title}</p>
                      <p className="mt-1 text-xs text-gray-600">{insight.summary}</p>
                      {insight.actionRequired && (
                        <button
                          className={`mt-2 rounded bg-white px-3 py-1.5 text-xs font-semibold shadow-sm ${text} hover:bg-gray-50`}
                          onClick={() => {
                            setScreen(insight.affectedModule);
                            window.location.hash = `screen=${insight.affectedModule}`;
                            onClose();
                          }}
                        >
                          Review in {insight.affectedModule}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ))}
          </>
        )}
      </div>
      <div className="border-t border-gray-100 p-2 text-center">
        <button
          className="w-full rounded-lg py-2 text-xs font-semibold text-[#3B5295] hover:bg-[#eef3f8]"
          onClick={() => { setScreen("ai"); window.location.hash = "screen=ai"; onClose(); }}
        >
          View all insights in AI Analytics
        </button>
      </div>
    </div>
  );
}

function ProfileDropdown({ apiState, onClose }: { apiState: ApiState; onClose: () => void }) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-[#d7e1ec] bg-white shadow-2xl">
      <div className="border-b border-gray-100 bg-gray-50 p-4">
        <p className="font-bold text-[#3B5295]">{apiState.user?.name ?? "Demo User"}</p>
        <p className="text-xs text-gray-500">{apiState.user?.role ?? "Guest Access"}</p>
      </div>
      <div className="p-2">
        <div className="px-2 py-1.5 text-xs font-semibold uppercase text-gray-400">System State</div>
        <div className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50">
          <div className="flex items-center gap-2"><Zap size={16} className={apiState.connected ? "text-green-500" : "text-amber-500"} /> Backend API</div>
          <span className="text-xs font-bold">{apiState.connected ? "Connected" : "Offline"}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50">
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#3B5295]" /> Permissions</div>
          <span className="text-xs font-bold">{apiState.user?.permissions?.length ?? 0} active</span>
        </div>
      </div>
      <div className="border-t border-gray-100 p-2">
        <button
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          onClick={() => { logoutFromApi(); window.location.reload(); }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );
}

function ProductionStatusPanel({ apiState }: { apiState: ApiState }) {
  const counts = apiState.health?.counts ?? {};
  return (
    <section className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">System Status</h2>
          <p className="mt-1 text-xs text-gray-500">API, tenant data, workflows, audit and module events</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${apiState.connected ? "bg-[#eef3f8] text-[#30447c]" : "bg-amber-50 text-warning"}`}>
          {apiState.connected ? "Connected" : "Fallback"}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          ["Database", apiState.health?.database ?? apiState.health?.mode ?? "demo"],
          ["Projects", counts.projects ?? 0],
          ["Procurement", counts.procurement ?? 0],
          ["Inventory", counts.inventory ?? 0],
          ["Documents", counts.documents ?? 0],
          ["Workflows", counts.workflows ?? 0]
        ].map(([label, value]) => (
          <div className="rounded-lg bg-[#f8fafc] p-3" key={label}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
            <p className="mt-1 text-sm font-bold text-[#3B5295]">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LoginPanel() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      await loginToApi({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? "")
      });
      window.location.reload();
    } catch {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-gray-900">
      {/* Left Pane - Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#1B3A6B] p-12 text-white lg:flex overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl font-bold shadow-sm backdrop-blur-md border border-white/20">
            NC
          </div>
          <span className="text-2xl font-bold tracking-tight">NirmaanCloud</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white">
            Build the future,<br/>manage the present.
          </h1>
          <p className="text-lg text-blue-100/80">
            The intelligent construction management suite for procurement, quality control, finance, and enterprise planning.
          </p>
        </div>
        
        <div className="relative z-10 text-sm font-medium text-blue-200/60">
          © {new Date().getFullYear()} NirmaanCloud. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-1/2 xl:px-32 relative bg-gray-50/50">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B5295] text-xl font-bold text-white shadow-md lg:hidden">
              BC
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-500">Please sign in to your enterprise account.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <input 
                  type="email"
                  name="email"
                  defaultValue="it@bcim.in"
                  required
                  className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#3B5295] focus:ring-4 focus:ring-[#3B5295]/10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input 
                  type="password"
                  name="password"
                  defaultValue="BCIM@2026@IT"
                  required
                  className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#3B5295] focus:ring-4 focus:ring-[#3B5295]/10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#3B5295] focus:ring-[#3B5295]" />
                <span className="text-sm font-medium text-gray-600">Remember me</span>
              </label>
              <button type="button" onClick={() => logoutFromApi()} className="text-sm font-semibold text-[#3B5295] hover:text-[#1B3A6B]">Clear Cache</button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600 border border-red-100">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-[#3B5295] px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#2b3c6e] focus:outline-none focus:ring-4 focus:ring-[#3B5295]/30 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ProjectContextBar() {
  return (
    <section className="grid overflow-hidden rounded-lg border border-[#d7e1ec] bg-white shadow-sm lg:grid-cols-[repeat(5,minmax(0,1fr))]">
      {[
        ["Company", "BCIM Engineering"],
        ["Project", "Metro Depot Package C7"],
        ["Client", "Maha Metro"],
        ["Budget Control", "Item-wise enabled"],
        ["Reporting Date", "09 May 2026"]
      ].map(([label, value]) => (
        <div className="border-b border-[#d7e1ec] p-4 lg:border-b-0 lg:border-r last:lg:border-r-0" key={label}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
          <p className="mt-1 truncate text-sm font-semibold text-[#3B5295]">{value}</p>
        </div>
      ))}
    </section>
  );
}

function ConstructionSignal({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#d7e1ec] bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef3f8]">
          <Icon size={16} className="text-[#3B5295]" />
        </div>
        <span className="text-xs font-bold text-gray-600">{label}</span>
      </div>
      <span className="text-xl font-bold text-[#3B5295]">{value}</span>
    </div>
  );
}

function ProcurementWorkspace({ apiState, page, setScreen }: { apiState: ApiState; page: ModulePage; setScreen: (screen: string) => void }) {
  const rows = getApiRowsForPage(page, apiState);
  const isPopup = Boolean(page.parentScreen);
  const kind = page.screen.replace("procurement-", "");
  const body = (
    <div className="space-y-5">
      <ProjectContextBar />
      <ProcurementHeader page={page} setScreen={setScreen} apiState={apiState} kind={kind} />
      {isPopup ? <ProcurementSubmenuBody kind={kind} rows={rows} /> : <ProcurementOverview rows={rows} setScreen={setScreen} apiState={apiState} />}
    </div>
  );
  if (!isPopup) return body;
  return (
    <div className="fixed inset-3 z-50 overflow-hidden rounded-xl border border-[#c7d6e6] bg-[#eef3f8] shadow-2xl md:inset-6">
      <div className="flex h-16 items-center justify-between border-b border-[#d7e1ec] bg-white px-5">
        <div><p className="text-xs font-bold uppercase tracking-wider text-gray-500">Procurement Workspace</p><h2 className="text-lg font-bold text-[#3B5295]">{page.title.replace("Procurement & Purchase - ", "")}</h2></div>
        <button className="rounded-lg border border-[#d7e1ec] bg-white px-4 py-2 text-sm font-semibold text-[#3B5295] hover:bg-[#f8fafc]" onClick={() => { window.location.hash = "screen=procurement"; setScreen("procurement"); }}>Close Screen</button>
      </div>
      <div className="h-[calc(100%-4rem)] overflow-y-auto p-5">{body}</div>
    </div>
  );
}

function ProcurementHeader({ page, setScreen, apiState, kind }: { page: ModulePage; setScreen: (screen: string) => void; apiState: ApiState; kind?: string }) {
  const tabs = ["Material Requisition", "RFQ", "Comparative Statement", "Purchase Orders", "Delivery Schedule", "Vendor Portal"];
  return (
    <section className="rounded-xl border border-[#d7e1ec] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#30447c]">Construction Procurement Control</p>
          <h1 className="mt-2 text-2xl font-bold text-[#3B5295]">{page.parentScreen ? page.title.replace("Procurement & Purchase - ", "") : "Procurement & Purchase"}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">End-to-end construction material procurement — MR → RFQ → Comparative Statement → PO → GRN</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[["MR Pending", apiState.procurement?.counts?.mrPending ?? "0", "bg-amber-50 text-amber-600"], ["RFQ Active", apiState.procurement?.counts?.rfqActive ?? "0", "bg-blue-50 text-blue-600"], ["PO Approval", apiState.procurement?.counts?.poApproval ?? "0", "bg-green-50 text-green-600"]].map(([label, value, cls]) => (
            <div className="rounded-xl border border-[#d7e1ec] bg-white px-5 py-4 shadow-sm" key={String(label)}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
              <p className={`mt-1 text-2xl font-black ${String(cls).split(" ").pop()}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto border-t border-gray-100 pt-5">
        {tabs.map((tab) => {
          const screen = `procurement-${slugify(tab)}`;
          const isActive = kind === slugify(tab);
          return (
            <button
              className={`shrink-0 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${isActive ? "bg-[#3B5295] text-white shadow-md" : "border border-[#d7e1ec] bg-[#f8fafc] text-gray-600 hover:border-[#3B5295] hover:text-[#3B5295]"}`}
              key={tab}
              onClick={() => { window.location.hash = `screen=${screen}`; setScreen(screen); }}
            >{tab}</button>
          );
        })}
      </div>
    </section>
  );
}

function ProcurementOverview({ rows, setScreen, apiState }: { rows: Row[]; setScreen: (screen: string) => void; apiState: ApiState }) {
  const cards: [string, string, string, LucideIcon][] = [
    ["Material Requisition", "Create and approve site material requests with WBS tracking", "procurement-material-requisition", ClipboardCheck],
    ["RFQ Management", "Issue RFQs to multiple vendors and collect competitive quotes", "procurement-rfq", SendHorizonal],
    ["Comparative Statement", "Compare vendor quotes side-by-side for best value selection", "procurement-comparative-statement", FileSpreadsheet],
    ["Purchase Orders", "Generate, approve and track purchase orders with delivery terms", "procurement-purchase-orders", FileCheck2],
    ["Delivery Schedule", "Monitor delivery timelines, transit status and delays", "procurement-delivery-schedule", Truck],
    ["Vendor Portal", "Manage vendor KYC, performance ratings and compliance", "procurement-vendor-portal", Building2]
  ];
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, desc, screen, Icon]) => (
          <button className="group relative overflow-hidden rounded-xl border border-[#d7e1ec] bg-white p-6 text-left shadow-sm transition-all hover:border-[#3B5295] hover:shadow-lg" key={title} onClick={() => { window.location.hash = `screen=${screen}`; setScreen(screen); }}>
            <div className="absolute -right-4 -top-4 opacity-[0.04] transition-opacity group-hover:opacity-[0.08]"><Icon size={80} /></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3f8] text-[#3B5295] transition-colors group-hover:bg-[#3B5295] group-hover:text-white"><Icon size={20} /></div>
            <h3 className="mt-4 text-base font-bold text-[#3B5295]">{title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">{desc}</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#3B5295] opacity-0 transition-opacity group-hover:opacity-100">Open <ChevronRight size={12} /></div>
          </button>
        ))}
      </section>
      <div className="space-y-5">
        <section className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Workflow Pipeline</h3>
          <div className="mt-5 space-y-4">
            {[["MR Created", apiState.procurement?.counts?.mrPending ?? 0, "bg-amber-500"], ["RFQ Issued", apiState.procurement?.counts?.rfqActive ?? 0, "bg-blue-500"], ["CS Evaluated", 0, "bg-purple-500"], ["PO Released", apiState.procurement?.counts?.poApproval ?? 0, "bg-green-500"]].map(([label, count, color]) => (
              <div key={String(label)} className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                <span className="flex-1 text-xs font-medium text-gray-600">{label}</span>
                <span className="text-sm font-bold text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </section>
        <ApprovalQueue rows={rows} title="Procurement Action Queue" />
      </div>
    </div>
  );
}

function ProcurementSubmenuBody({ kind, rows }: { kind: string; rows: Row[] }) {
  if (kind === "material-requisition") return <MaterialRequisitionScreen rows={rows} />;
  if (kind === "rfq") return <RfqScreen rows={rows} />;
  if (kind === "comparative-statement") return <ComparativeStatementScreen rows={rows} />;
  if (kind === "purchase-orders") return <PurchaseOrdersScreen rows={rows} />;
  if (kind === "delivery-schedule") return <DeliveryScheduleScreen rows={rows} />;
  if (kind === "vendor-portal") return <VendorPortalScreen rows={rows} />;
  return <ApprovalQueue rows={rows} title="Procurement Worklist" />;
}

function MaterialRequisitionScreen({ rows }: { rows: Row[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <section className="rounded-xl border border-[#d7e1ec] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-[#3B5295]">New Material Requisition</h2>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Draft</span>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            { label: "Project / Site", placeholder: "Select Project" },
            { label: "WBS / Cost Code", placeholder: "e.g. 1.1.2 Structure" },
            { label: "Required Date", placeholder: "Select Date", type: "date" },
            { label: "Priority", placeholder: "Medium", type: "select" }
          ].map((f) => (
            <div key={f.label} className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{f.label}</label>
              {f.type === "select" ? (
                <select className="w-full rounded-lg border border-[#d7e1ec] bg-[#f8fafc] px-4 py-2.5 text-sm outline-none focus:border-[#3B5295]">
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              ) : (
                <input type={f.type || "text"} className="w-full rounded-lg border border-[#d7e1ec] bg-[#f8fafc] px-4 py-2.5 text-sm outline-none focus:border-[#3B5295]" placeholder={f.placeholder} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-bold text-gray-700">Material Line Items</h3>
            <button className="text-xs font-bold text-[#3B5295] hover:underline">+ Add Row</button>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#d7e1ec]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase text-gray-400">
                <tr>
                  <th className="px-4 py-3">Material Description</th>
                  <th className="px-4 py-3">Specification</th>
                  <th className="px-4 py-3 text-center">Unit</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2].map((i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3"><input className="w-full bg-transparent outline-none" placeholder="e.g. OPC 53 Grade Cement" /></td>
                    <td className="px-4 py-3"><input className="w-full bg-transparent outline-none" placeholder="IS Standard" /></td>
                    <td className="px-4 py-3 text-center"><select className="bg-transparent outline-none text-xs"><option>Bags</option><option>MT</option><option>Kg</option><option>Nos</option></select></td>
                    <td className="px-4 py-3 text-right"><input className="w-20 bg-transparent text-right outline-none" placeholder="0" /></td>
                    <td className="px-4 py-3 text-center"><button className="text-gray-300 hover:text-red-500"><X size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Site Engineer Remarks</label>
          <textarea className="mt-2 min-h-20 w-full rounded-lg border border-[#d7e1ec] bg-[#f8fafc] p-3 text-sm outline-none focus:border-[#3B5295]" placeholder="Justification..." />
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-6">
          <button className="rounded-lg border border-[#d7e1ec] px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">Save Draft</button>
          <button className="rounded-lg bg-[#3B5295] px-8 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#30447c]">Submit for Approval</button>
        </div>
      </section>
      <div className="space-y-5">
        <ApprovalQueue rows={rows} title="Recent Requisitions" />
        <section className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">MR Status Legend</h3>
          <div className="mt-4 space-y-3">
            {[["Pending", "bg-amber-500"], ["Approved", "bg-green-500"], ["RFQ Issued", "bg-blue-500"], ["PO Generated", "bg-purple-500"]].map(([label, color]) => (
              <div key={label} className="flex items-center gap-3 text-xs text-gray-600"><div className={`h-2 w-2 rounded-full ${color}`} /> {label}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function RfqScreen({ rows }: { rows: Row[] }) {
  const lanes = [
    { name: "Draft RFQs", status: "Draft", color: "text-gray-500" },
    { name: "Sent to Vendors", status: "Open", color: "text-blue-500" },
    { name: "Quotes Received", status: "Quoted", color: "text-green-500" }
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#3B5295]">Request for Quotation</h2>
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-bold border border-[#d7e1ec]">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> LIVE
          </div>
        </div>
        <button className="rounded-lg bg-[#3B5295] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#30447c]">+ Issue New RFQ</button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {lanes.map((lane) => (
          <div key={lane.name} className="flex flex-col rounded-xl border border-[#d7e1ec] bg-[#f8fafc]/50">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <h3 className={`text-sm font-bold ${lane.color}`}>{lane.name}</h3>
              <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-gray-400 border border-gray-100">
                {rows.filter(r => r.status === lane.status || (lane.status === "Quoted" && r.status === "Negotiation")).length}
              </span>
            </div>
            <div className="min-h-[300px] space-y-3 p-4">
              {rows.filter(r => r.status === lane.status || (lane.status === "Quoted" && r.status === "Negotiation")).map((row) => (
                <div className="rounded-xl border border-[#d7e1ec] bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-pointer" key={`${lane.name}-${row.id}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400">#{row.id.substring(0, 8)}</span>
                    <StatusBadge status={row.status} />
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-[#3B5295]">{row.primary}</h4>
                  <p className="mt-1 text-xs text-gray-500 truncate">{row.secondary}</p>
                  <p className="mt-3 text-xs font-bold text-[#30447c]">{row.value}</p>
                </div>
              ))}
              {rows.filter(r => r.status === lane.status || (lane.status === "Quoted" && r.status === "Negotiation")).length === 0 && (
                <div className="flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-300">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparativeStatementScreen({ rows }: { rows: Row[] }) {
  return (
    <section className="rounded-xl border border-[#d7e1ec] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-[#3B5295]">Comparative Statement (CS)</h2>
          <p className="text-xs text-gray-500 mt-1">Side-by-side vendor rate analysis for construction materials</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-[#d7e1ec] bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">
            <FileText size={14} /> Export
          </button>
          <button className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-green-700">
            Approve CS & Release PO
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-gray-100">
              <th className="sticky left-0 bg-[#f8fafc] px-6 py-4 font-bold text-gray-700 border-r border-gray-100">Item Details</th>
              <th className="px-6 py-4 text-center font-bold text-gray-700 border-r border-gray-100 bg-blue-50/30">L1: UltraTech</th>
              <th className="px-6 py-4 text-center font-bold text-gray-700 border-r border-gray-100">L2: ACC Cement</th>
              <th className="px-6 py-4 text-center font-bold text-gray-700">L3: Ambuja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { item: "OPC 53 Grade Cement", qty: "5000 Bags", u1: "₹ 410/bag", u2: "₹ 415/bag", u3: "₹ 420/bag" },
              { item: "PPC Cement", qty: "2000 Bags", u1: "₹ 385/bag", u2: "₹ 390/bag", u3: "₹ 388/bag" },
              { item: "Freight Charges", qty: "Lump sum", u1: "Included", u2: "₹ 12,000", u3: "Included" },
              { item: "GST / Taxes", qty: "28%", u1: "Extra", u2: "Extra", u3: "Inclusive" },
              { item: "Payment Terms", qty: "-", u1: "30 Days", u2: "Immediate", u3: "45 Days" }
            ].map((r, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="sticky left-0 bg-white px-6 py-4 border-r border-gray-100">
                  <p className="font-bold text-gray-800">{r.item}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{r.qty}</p>
                </td>
                <td className="px-6 py-4 text-center font-medium text-blue-700 border-r border-gray-100 bg-blue-50/10">{r.u1}</td>
                <td className="px-6 py-4 text-center text-gray-600 border-r border-gray-100">{r.u2}</td>
                <td className="px-6 py-4 text-center text-gray-600">{r.u3}</td>
              </tr>
            ))}
            <tr className="bg-[#f8fafc] font-bold">
              <td className="sticky left-0 bg-[#f8fafc] px-6 py-5 border-r border-gray-100 text-base">Total Landing Cost</td>
              <td className="px-6 py-5 text-center text-lg text-blue-700 border-r border-gray-100 bg-blue-50/30">₹ 28,20,000</td>
              <td className="px-6 py-5 text-center text-lg text-gray-700 border-r border-gray-100">₹ 28,65,000</td>
              <td className="px-6 py-5 text-center text-lg text-gray-700">₹ 28,90,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Purchase Committee Recommendation</h3>
        <p className="mt-3 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
          Recommend awarding to <strong>UltraTech Cement (L1)</strong> due to lowest landing cost and 30-day credit period aligned with project cash flow. Delivery confirmed within 48 hours of PO release.
        </p>
      </div>
    </section>
  );
}

function PurchaseOrdersScreen({ rows }: { rows: Row[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#3B5295]">Purchase Orders</h2>
        <button className="rounded-lg bg-[#3B5295] px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-[#30447c]">Release New PO</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-[#d7e1ec] bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">PO Number</th>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#3B5295]">{row.id.substring(0, 8).toUpperCase()}</td>
                <td className="px-6 py-4 font-medium text-gray-700">{row.owner}</td>
                <td className="px-6 py-4 text-gray-500">{row.primary}</td>
                <td className="px-6 py-4 text-right font-bold text-gray-800">{row.value}</td>
                <td className="px-6 py-4 text-center"><StatusBadge status={row.status} /></td>
                <td className="px-6 py-4"><button className="text-gray-400 hover:text-[#3B5295]"><ChevronRight size={16} /></button></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-gray-400">No purchase orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeliveryScheduleScreen({ rows }: { rows: Row[] }) {
  const steps = ["Ordered", "Dispatched", "In Transit", "Out for Delivery", "Received (GRN)"];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#3B5295]">Delivery & Logistics Tracker</h2>
      {rows.length === 0 && <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-[#d7e1ec]">No active deliveries. Deliveries will appear once POs are released.</div>}
      {rows.slice(0, 4).map((row, ri) => {
        const done = Math.min(2 + ri, 5);
        return (
          <div key={row.id} className="rounded-xl border border-[#d7e1ec] bg-white overflow-hidden shadow-sm">
            <div className="flex items-center justify-between bg-[#f8fafc] px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-2 border border-gray-100"><Truck size={18} className="text-[#3B5295]" /></div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{row.primary}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{row.secondary}</p>
                </div>
              </div>
              <StatusBadge status={done >= 5 ? "Received" : "In Transit"} />
            </div>
            <div className="p-6">
              <div className="relative flex justify-between">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100" />
                <div className="absolute top-4 left-0 h-0.5 bg-[#3B5295]" style={{ width: `${((done - 1) / (steps.length - 1)) * 100}%` }} />
                {steps.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${idx < done ? "border-[#3B5295] bg-[#3B5295] text-white" : "border-gray-200 bg-white text-gray-300"}`}>
                      {idx < done ? <CheckCircle2 size={14} /> : <div className="h-2 w-2 rounded-full bg-current" />}
                    </div>
                    <span className={`mt-2 text-[9px] font-bold uppercase text-center ${idx < done ? "text-[#3B5295]" : "text-gray-400"}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VendorPortalScreen({ rows }: { rows: Row[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#3B5295]">Vendor Management</h2>
          <button className="rounded-lg bg-[#3B5295] px-4 py-2 text-xs font-bold text-white shadow-md">Register Vendor</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((row, idx) => (
            <div key={row.id} className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef3f8] text-[#3B5295] font-bold text-lg">{row.primary.charAt(0)}</div>
                <StatusBadge status={row.status} />
              </div>
              <h3 className="mt-3 font-bold text-gray-800">{row.primary}</h3>
              <p className="mt-1 text-sm text-gray-500">{row.secondary}</p>
              <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex gap-4">
                  <div><p className="text-[9px] font-bold text-gray-400 uppercase">Rating</p><p className="text-sm font-bold text-amber-500">{(4.2 + (idx % 3) * 0.3).toFixed(1)}/5</p></div>
                  <div><p className="text-[9px] font-bold text-gray-400 uppercase">POs</p><p className="text-sm font-bold text-gray-700">{12 + idx * 4}</p></div>
                </div>
                <button className="text-xs font-bold text-[#3B5295] hover:underline">Profile ›</button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="col-span-2 p-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">No vendors registered yet.</div>
          )}
        </div>
      </section>
      <aside className="space-y-5">
        <section className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vendor Performance</h3>
          <div className="mt-5 space-y-5">
            {[["Delivery Adherence", 94], ["Quality Compliance", 98], ["Price Competitiveness", 88]].map(([label, value]) => (
              <div key={String(label)} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-[#3B5295]">{value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#3B5295]" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent KYC Updates</h3>
          <div className="mt-4 space-y-3">
            {[["GST Updated", "UltraTech", "2h ago"], ["PAN Verified", "ACC Ltd", "5h ago"], ["MSME Cert", "Ambuja", "1d ago"]].map(([action, vendor, time]) => (
              <div key={String(action)} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50">
                <FileCheck2 size={14} className="text-gray-400" />
                <div>
                  <p className="text-xs font-bold text-gray-700">{action}</p>
                  <p className="text-[10px] text-gray-400">{vendor} • {time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function ApprovalQueue({ rows, title }: { rows: Row[]; title: string }) {
  return (
    <section className="rounded-xl border border-[#d7e1ec] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
        <span className="text-[10px] font-bold text-[#3B5295]">{rows.length} items</span>
      </div>
      <div className="mt-4 space-y-3">
        {rows.slice(0, 6).map((row) => (
          <div className="group flex items-center justify-between rounded-lg p-2.5 transition-all hover:bg-[#f8fafc]" key={row.id}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef3f8] text-[#3B5295] transition-colors group-hover:bg-white group-hover:shadow-sm">
                <ClipboardCheck size={16} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-gray-700">{row.primary}</p>
                <p className="truncate text-[10px] text-gray-400">{row.secondary}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="text-[10px] font-bold text-[#3B5295]">{row.value}</p>
              <StatusBadge status={row.status} />
            </div>
          </div>
        ))}
        {rows.length === 0 && <div className="py-6 text-center text-[10px] font-bold uppercase tracking-widest text-gray-300">No active items</div>}
      </div>
    </section>
  );
}

function PremiumModulePage({ apiState, page, setScreen }: { apiState: ApiState; page: ModulePage; setScreen: (screen: string) => void }) {
  if ((page.parentScreen ?? page.screen) === "procurement") {
    return <ProcurementWorkspace apiState={apiState} page={page} setScreen={setScreen} />;
  }

  const Icon = page.icon;
  const parentScreen = page.parentScreen ?? page.screen;
  const parentModule = moduleByScreen[parentScreen] ?? page;
  const isSubmenu = Boolean(page.parentScreen);
  const canMutate = canMutateModule(parentModule, apiState);
  const apiRows = getApiRowsForPage(page, apiState);
  const [rows, setRows] = useState<Row[]>(apiRows);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [modal, setModal] = useState<ModalState>(null);
  const [dbIdMap, setDbIdMap] = useState<Record<string, string>>({}); // maps display id -> database uuid

  useEffect(() => {
    setQuery("");
    setStatus("All statuses");
    setModal(null);

    // Try loading from the database first
    fetchRecords(DEFAULT_TENANT_ID, page.screen)
      .then((records) => {
        if (records.length > 0) {
          const mapped: Row[] = records.map((r) => ({
            id: r.recordId,
            primary: r.primary,
            secondary: r.secondary,
            value: r.value,
            owner: r.owner,
            status: r.status,
          }));
          setRows(mapped);
          const idMap: Record<string, string> = {};
          records.forEach((r) => { idMap[r.recordId] = r.id; });
          setDbIdMap(idMap);
        } else {
          setRows([]);
        }
      })
      .catch(() => {
        setRows([]);
      });
  }, [apiState.connected, page.screen, page.rows]);

  const statuses = Array.from(new Set(rows.map((row) => row.status)));
  const filteredRows = rows.filter((row) => {
    const haystack = Object.values(row).join(" ").toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    const matchesStatus = status === "All statuses" || row.status === status;
    return matchesQuery && matchesStatus;
  });

  function saveRow(row: Row) {
    const isEdit = modal?.mode === "edit";

    if (isEdit && dbIdMap[row.id]) {
      // Update existing record in database
      updateRecord(DEFAULT_TENANT_ID, page.screen, dbIdMap[row.id], {
        primary: row.primary,
        secondary: row.secondary,
        value: row.value,
        owner: row.owner,
        status: row.status,
      }).catch(console.error);
    } else {
      // Create new record in database
      createRecord(DEFAULT_TENANT_ID, page.screen, {
        recordId: row.id,
        primary: row.primary,
        secondary: row.secondary,
        value: row.value,
        owner: row.owner,
        status: row.status,
      })
        .then((created) => {
          setDbIdMap((prev) => ({ ...prev, [row.id]: created.id }));
        })
        .catch(console.error);
    }

    setRows((current) => {
      if (isEdit) {
        return current.map((item) => (item.id === row.id ? row : item));
      }
      return [row, ...current];
    });
    setModal(null);
    recordModuleAction(page, isEdit ? "edit" : "create", row.primary);
  }

  function deleteRow(row: Row) {
    // Delete from database if we have the UUID
    if (dbIdMap[row.id]) {
      deleteRecord(DEFAULT_TENANT_ID, page.screen, dbIdMap[row.id]).catch(console.error);
      setDbIdMap((prev) => {
        const next = { ...prev };
        delete next[row.id];
        return next;
      });
    }

    setRows((current) => current.filter((item) => item.id !== row.id));
    setModal(null);
    recordModuleAction(page, "delete", row.primary);
  }

  if (isSubmenu) {
    if (page.screen === "mobile-site-engineer-app") return <MobileDprScreen canMutate={canMutate} page={page} />;
    if (page.screen === "inventory-gate-pass") return <MobileGatePassScreen canMutate={canMutate} page={page} />;
    if (page.screen === "quality-checklists") return <MobileQaQcScreen canMutate={canMutate} page={page} />;

    return (
      <div className="min-h-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Minimalist Premium Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-gray-100" style={{ color: page.accent }}>
              <Icon size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500">
                <span className="hover:text-primary cursor-pointer" onClick={() => { window.location.hash = `screen=${parentModule.screen}`; setScreen(parentModule.screen); }}>{parentModule.title}</span>
                <span>/</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">{page.title.split(' - ')[1] ?? page.title}</h1>
            </div>
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primaryDark transition-all disabled:opacity-50" disabled={!canMutate} onClick={() => setModal({ mode: "create" })}>
            {canMutate ? page.action : "Read-only access"}
          </button>
        </div>

        <div className="p-4 bg-white">
          {/* Subtle Inline Stats */}
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            {page.stats.map((stat) => (
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3" key={stat.label}>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className={`mt-1 text-lg font-bold ${stat.tone}`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Core Data View */}
          {/* Core Data View */}
          <div className={["admin-users","admin-branches","admin-departments","admin-roles","admin-permissions","admin-approval-matrix","admin-audit-logs","admin-system-settings"].includes(page.screen) ? "" : "rounded-xl border border-gray-200 overflow-hidden"}>
            {page.screen === "admin-users" ? (
              <AdminUsersScreen rows={filteredRows} canMutate={canMutate} onEdit={(row) => setModal({ mode: "edit", row })} onDelete={deleteRow} />
            ) : page.screen === "admin-branches" ? (
              <AdminBranchesScreen rows={filteredRows} canMutate={canMutate} onEdit={(row) => setModal({ mode: "edit", row })} onDelete={deleteRow} />
            ) : page.screen === "admin-departments" ? (
              <AdminDepartmentsScreen rows={filteredRows} canMutate={canMutate} onEdit={(row) => setModal({ mode: "edit", row })} />
            ) : page.screen === "admin-roles" ? (
              <AdminRolesScreen rows={filteredRows} canMutate={canMutate} onEdit={(row) => setModal({ mode: "edit", row })} />
            ) : page.screen === "admin-permissions" ? (
              <AdminPermissionsScreen canMutate={canMutate} />
            ) : page.screen === "admin-approval-matrix" ? (
              <AdminApprovalMatrixScreen rows={filteredRows} canMutate={canMutate} />
            ) : page.screen === "admin-audit-logs" ? (
              <AdminAuditLogsScreen rows={filteredRows} />
            ) : page.screen === "admin-system-settings" ? (
              <AdminSystemSettingsScreen canMutate={canMutate} />
            ) : (
              <SubmenuScreen
                onDelete={deleteRow}
                onEdit={(row) => setModal({ mode: "edit", row })}
                onView={(row) => setModal({ mode: "view", row })}
                canMutate={canMutate}
                page={page}
                query={query}
                rows={filteredRows}
                setQuery={setQuery}
                setStatus={setStatus}
                status={status}
                statuses={statuses}
                total={rows.length}
              />
            )}
          </div>
        </div>
        
        {modal ? <RecordModal modal={modal} page={page} onClose={() => setModal(null)} onDelete={deleteRow} onSave={saveRow} /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ProjectContextBar />
      <SubmenuTabs activeScreen={page.screen} parent={parentModule} setScreen={setScreen} />
      <section className="overflow-hidden rounded-lg border border-[#d7e1ec] bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1fr_320px]">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md text-white" style={{ backgroundColor: page.accent }}><Icon size={22} /></div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{page.group}</p>
                <h1 className="text-2xl font-bold text-[#3B5295]">{page.title}</h1>
              </div>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-gray-600">{page.subtitle}</p>
          </div>
          <div className="border-t border-[#d7e1ec] bg-[#f8fafc] p-6 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Automation brief</p>
            <p className="mt-3 text-sm leading-6 text-gray-700">{page.automations[0]} and {page.automations[1]} are active for this module.</p>
            <button className="mt-4 w-full rounded-md bg-[#3B5295] px-4 py-2 text-sm font-medium text-white hover:bg-[#138f84] disabled:cursor-not-allowed disabled:opacity-50" disabled={!canMutate} onClick={() => setModal({ mode: "create" })}>{canMutate ? page.action : "Read-only access"}</button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {page.stats.map((stat) => (
          <div className="rounded-lg border border-[#d7e1ec] bg-white p-5 shadow-sm" key={stat.label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</p>
            <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <ProcessFlow steps={page.workflows} />
          <SubmenuScreen
            onDelete={deleteRow}
            onEdit={(row) => setModal({ mode: "edit", row })}
            onView={(row) => setModal({ mode: "view", row })}
            canMutate={canMutate}
            page={page}
            query={query}
            rows={filteredRows}
            setQuery={setQuery}
            setStatus={setStatus}
            status={status}
            statuses={statuses}
            total={rows.length}
          />
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-[#d7e1ec] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Smart Automations</h2>
            <div className="mt-4 space-y-3">
              {page.automations.map((automation) => (
                <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-sm" key={automation}>
                  <Sparkles className="text-info" size={17} />
                  <span className="font-medium text-gray-700">{automation}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#d7e1ec] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Workflow State</h2>
            <div className="mt-4 space-y-3">
              {page.workflows.map((workflow, index) => (
                <div className="flex items-center gap-3" key={workflow}>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index < 3 ? "bg-green-50 text-success" : "bg-amber-50 text-warning"}`}>{index + 1}</span>
                  <span className="text-sm font-medium text-gray-700">{workflow}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#0d2749] bg-[#3B5295] p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 text-accent"><Bot size={18} /><span className="text-sm font-bold">AI assistant</span></div>
            <p className="mt-3 text-sm leading-6 text-white/75">Ask for forecast, pending approvals, anomaly reasons, cash impact, or a PDF/Excel report for this module.</p>
          </div>
        </aside>
      </section>
      {modal ? <RecordModal modal={modal} page={page} onClose={() => setModal(null)} onDelete={deleteRow} onSave={saveRow} /> : null}
    </div>
  );
}

function DataGrid({
  canMutate = true,
  onDelete,
  onEdit,
  onView,
  page,
  rows,
  total
}: {
  canMutate?: boolean;
  onDelete: (row: Row) => void;
  onEdit: (row: Row) => void;
  onView: (row: Row) => void;
  page: ModulePage;
  rows: Row[];
  total: number;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#d7e1ec] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#d7e1ec] bg-[#f8fafc] px-4 py-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Transaction Worklist</p>
          <h2 className="text-sm font-semibold text-[#3B5295]">{page.title}</h2>
        </div>
        <span className="rounded-full bg-[#eef3f8] px-2 py-0.5 text-[10px] font-semibold text-[#30447c]">Budget linked</span>
      </div>
      <div className="overflow-x-auto">
      <table className="min-w-[860px] divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            {page.columns.map((header) => (
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500" key={header}>{header}</th>
            ))}
            <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr className="transition-colors duration-100 hover:bg-blue-50" key={row.id}>
              <td className="px-4 py-2 text-xs font-semibold text-primary">{row.id}</td>
              <td className="px-4 py-2 text-xs font-medium text-gray-800">{row.primary}</td>
              <td className="px-4 py-2 text-xs text-gray-700">{row.secondary}</td>
              <td className="px-4 py-2 text-xs font-semibold text-gray-800">{row.value}</td>
              <td className="px-4 py-2 text-xs text-gray-700">{row.owner}</td>
              <td className="px-4 py-2"><StatusBadge status={row.status} /></td>
              <td className="px-4 py-2">
                <div className="flex justify-end gap-1">
                  <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary" title="View" onClick={() => onView(row)}><Eye size={14} /></button>
                  <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary disabled:opacity-30" disabled={!canMutate} title="Edit" onClick={() => onEdit(row)}><Pencil size={14} /></button>
                  <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-danger disabled:opacity-30" disabled={!canMutate} title="Delete" onClick={() => onDelete(row)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? <div className="p-6 text-center text-xs text-gray-500">No records found for the selected filters.</div> : null}
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-gray-600">
        <span>Showing {rows.length ? 1 : 0}-{rows.length} of {total} records</span>
        <div className="flex gap-2">
          <button className="rounded-lg border border-gray-300 px-2 py-1 hover:bg-gray-50">Previous</button>
          <button className="rounded-lg border border-gray-300 px-2 py-1 hover:bg-gray-50">Next</button>
        </div>
      </div>
    </section>
  );
}

function SubmenuScreen({
  canMutate,
  onDelete,
  onEdit,
  onView,
  page,
  query,
  rows,
  setQuery,
  setStatus,
  status,
  statuses,
  total
}: {
  canMutate: boolean;
  onDelete: (row: Row) => void;
  onEdit: (row: Row) => void;
  onView: (row: Row) => void;
  page: ModulePage;
  query: string;
  rows: Row[];
  setQuery: (value: string) => void;
  setStatus: (value: string) => void;
  status: string;
  statuses: string[];
  total: number;
}) {
  const kind = getScreenKind(page);

  if (kind === "board") return <BoardScreen page={page} rows={rows} />;
  if (kind === "form") return <FormScreen page={page} rows={rows} />;
  if (kind === "ledger") {
    return (
      <>
        <FilterBar page={page} query={query} setQuery={setQuery} setStatus={setStatus} status={status} statuses={statuses} />
        <DataGrid canMutate={canMutate} page={page} rows={rows} onView={onView} onEdit={onEdit} onDelete={onDelete} total={total} />
      </>
    );
  }
  if (kind === "inspection") return <InspectionScreen page={page} rows={rows} />;
  if (kind === "documents") return <DocumentScreen page={page} rows={rows} />;
  if (kind === "analytics") {
    if (page.screen === "ai") return <AiCockpitScreen />;
    return <AnalyticsScreen page={page} rows={rows} />;
  }

  return (
    <>
      <OperationsScreen page={page} rows={rows} />
      <FilterBar page={page} query={query} setQuery={setQuery} setStatus={setStatus} status={status} statuses={statuses} />
      <DataGrid canMutate={canMutate} page={page} rows={rows} onView={onView} onEdit={onEdit} onDelete={onDelete} total={total} />
    </>
  );
}

function FilterBar({ page, query, setQuery, setStatus, status, statuses }: { page: ModulePage; query: string; setQuery: (value: string) => void; setStatus: (value: string) => void; status: string; statuses: string[] }) {
  return (
    <div className="rounded-lg border border-[#d7e1ec] bg-white p-3 shadow-sm">
      <div className="grid gap-2 md:grid-cols-[1.5fr_1fr_1fr_auto]">
        <div className="flex items-center rounded-md border border-gray-300 px-2">
          <Search size={14} className="mr-2 text-gray-400" />
          <input className="w-full py-1.5 text-xs outline-none" placeholder={`Search ${page.title.toLowerCase()}`} value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <select className="rounded-md border border-gray-300 px-2 py-1.5 text-xs" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All statuses</option>
          {statuses.map((item) => <option key={item}>{item}</option>)}
        </select>
        <input className="rounded-md border border-gray-300 px-2 py-1.5 text-xs" type="date" />
        <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primaryDark" onClick={() => { setQuery(""); setStatus("All statuses"); }}>Reset</button>
      </div>
    </div>
  );
}

function BoardScreen({ page, rows }: { page: ModulePage; rows: Row[] }) {
  const lanes = ["Draft", "Submitted", "Approval", "Released"];
  return (
    <section className="grid gap-3 rounded-lg border border-[#d7e1ec] bg-white p-4 shadow-sm md:grid-cols-4">
      {lanes.map((lane, laneIndex) => (
        <div className="rounded-md border border-[#d7e1ec] bg-[#f8fafc] p-3" key={lane}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B5295]">{lane}</h3>
            <span className="rounded-full bg-white px-2 py-1 text-xs text-gray-500">{laneIndex + 2}</span>
          </div>
          <div className="space-y-2">
            {rows.map((row) => (
              <div className="rounded-md border border-[#d7e1ec] bg-white p-3" key={`${lane}-${row.id}`}>
                <p className="text-xs font-bold text-gray-500">{row.id}</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">{row.primary}</p>
                <p className="mt-2 text-xs text-gray-500">{row.owner} - {row.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function FormScreen({ page, rows }: { page: ModulePage; rows: Row[] }) {
  return (
    <section className="grid gap-5 rounded-lg border border-[#d7e1ec] bg-white p-5 shadow-sm xl:grid-cols-[1fr_320px]">
      <div className="grid gap-4 md:grid-cols-2">
        {["Project", "Package", "Vendor/Party", "Cost Code", "Quantity", "Required Date"].map((label) => (
          <label className="block" key={label}>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
            <input className="mt-1 w-full rounded-md border border-[#d7e1ec] px-3 py-2 text-sm outline-none focus:border-[#3B5295]" placeholder={label} />
          </label>
        ))}
        <label className="block md:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Remarks / Scope</span>
          <textarea className="mt-1 min-h-24 w-full rounded-md border border-[#d7e1ec] px-3 py-2 text-sm outline-none focus:border-[#3B5295]" placeholder={`${page.title} details`} />
        </label>
      </div>
      <div className="rounded-md bg-[#f8fafc] p-4">
        <h3 className="text-sm font-bold text-[#3B5295]">Recent Entries</h3>
        <div className="mt-3 space-y-2">
          {rows.map((row) => <p className="rounded-md bg-white p-3 text-xs font-semibold text-gray-700" key={row.id}>{row.primary}</p>)}
        </div>
      </div>
    </section>
  );
}

function InspectionScreen({ page, rows }: { page: ModulePage; rows: Row[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {rows.map((row, index) => (
        <div className="rounded-lg border border-[#d7e1ec] bg-white p-5 shadow-sm" key={row.id}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">{page.title}</p>
              <h3 className="mt-2 text-base font-bold text-[#3B5295]">{row.primary}</h3>
            </div>
            <StatusBadge status={row.status} />
          </div>
          <div className="mt-4 h-28 rounded-md bg-[linear-gradient(135deg,#eef3f8,#eef3f8)] p-3 text-xs text-gray-600">Geo-tagged evidence panel {index + 1}</div>
          <p className="mt-3 text-sm text-gray-600">{row.secondary} - {row.owner}</p>
        </div>
      ))}
    </section>
  );
}

function DocumentScreen({ page, rows }: { page: ModulePage; rows: Row[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {rows.map((row) => (
        <div className="rounded-lg border border-[#d7e1ec] bg-white p-5 shadow-sm" key={row.id}>
          <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-[#3B5295] bg-[#eef3f8] text-sm font-bold text-[#30447c]">{row.id}</div>
          <h3 className="mt-4 text-sm font-bold text-[#3B5295]">{row.primary}</h3>
          <p className="mt-1 text-xs text-gray-500">{row.secondary}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">{row.value}</span>
            <StatusBadge status={row.status} />
          </div>
        </div>
      ))}
    </section>
  );
}

function AnalyticsScreen({ page, rows }: { page: ModulePage; rows: Row[] }) {
  return (
    <section className="rounded-lg border border-[#d7e1ec] bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex h-72 items-end gap-4 border-b border-l border-[#d7e1ec] px-5 pb-5">
          {[54, 71, 48, 82, 65, 91].map((value, index) => <div className="flex-1 rounded-t-md bg-[#3B5295]" key={index} style={{ height: `${value}%` }} />)}
        </div>
        <div className="space-y-3">
          {rows.map((row) => (
            <div className="rounded-md border border-[#d7e1ec] bg-[#f8fafc] p-3" key={row.id}>
              <p className="text-sm font-bold text-[#3B5295]">{row.primary}</p>
              <p className="mt-1 text-xs text-gray-500">{row.value} - {row.owner}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OperationsScreen({ page, rows }: { page: ModulePage; rows: Row[] }) {
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {rows.map((row, index) => (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="rounded-lg border border-[#d7e1ec] bg-white p-4 shadow-sm hover:border-[#3B5295] transition-all" key={row.id}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{row.id}</p>
          <h3 className="mt-1 text-sm font-bold text-[#3B5295]">{row.primary}</h3>
          <p className="mt-1 text-xs text-gray-600">{row.secondary}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-bold text-[#30447c]">{row.value}</span>
            <StatusBadge status={row.status} />
          </div>
        </motion.div>
      ))}
    </section>
  );
}

function SubmenuTabs({ activeScreen, parent, setScreen }: { activeScreen: string; parent: ModulePage; setScreen: (screen: string) => void }) {
  const tabs = [{ label: "Overview", screen: parent.screen }, ...(submenuLabels[parent.screen] ?? []).map((label) => ({ label, screen: `${parent.screen}-${slugify(label)}` }))];

  return (
    <section className="rounded-lg border border-[#d7e1ec] bg-white p-2 shadow-sm">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${activeScreen === tab.screen ? "bg-[#3B5295] text-white" : "bg-[#f8fafc] text-gray-600 hover:bg-[#eef3f8] hover:text-[#30447c]"}`}
            href={`/#screen=${tab.screen}`}
            key={tab.screen}
            onClick={(event) => {
              event.preventDefault();
              window.history.pushState(null, "", `/#screen=${tab.screen}`);
              setScreen(tab.screen);
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProcessFlow({ steps }: { steps: string[] }) {
  return (
    <section className="rounded-lg border border-[#d7e1ec] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#3B5295]">Process Flow</h2>
        <span className="text-xs font-semibold text-[#30447c]">Auto-routed approvals</span>
      </div>
      <div className="grid gap-2 md:grid-cols-5">
        {steps.map((step, index) => (
          <div className="rounded-md border border-[#d7e1ec] bg-[#f8fafc] p-3" key={step}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index < 3 ? "bg-[#eef3f8] text-[#30447c]" : "bg-amber-50 text-warning"}`}>{index + 1}</span>
            <p className="mt-3 text-xs font-semibold text-gray-700">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModuleSpecificFields({ screen, readOnly }: { screen: string; readOnly: boolean }) {
  if (screen.startsWith("admin")) {
    return (
      <div className="border-t border-gray-100 pt-3">
        <h3 className="mb-2 text-sm font-bold text-[#3B5295]">Admin & Configuration</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <FormField label="Tax Registration (GST/VAT)" name="taxId" readOnly={readOnly} />
          <FormField label="Contact Person" name="contactPerson" readOnly={readOnly} />
          <FormField label="Phone Number" name="phone" readOnly={readOnly} />
          <FormField label="Email Address" name="email" readOnly={readOnly} />
          <label className="block md:col-span-2">
            <span className="mb-1 block text-xs font-medium text-gray-700">Registered Address</span>
            <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-50" disabled={readOnly} />
          </label>
        </div>
      </div>
    );
  }
  if (screen.startsWith("project") || screen.startsWith("tendering")) {
    return (
      <div className="border-t border-gray-100 pt-3">
        <h3 className="mb-2 text-sm font-bold text-[#3B5295]">Project Details</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <FormField label="Client Name" name="client" readOnly={readOnly} />
          <FormField label="Location / Site" name="location" readOnly={readOnly} />
          <FormField label="Total Estimated Budget" name="budget" readOnly={readOnly} />
          <FormField label="Project Manager" name="pm" readOnly={readOnly} />
        </div>
      </div>
    );
  }
  if (screen.startsWith("procurement")) {
    return (
      <div className="border-t border-gray-100 pt-3">
        <h3 className="mb-2 text-sm font-bold text-[#3B5295]">Procurement Details</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <FormField label="Vendor / Supplier Name" name="vendor" readOnly={readOnly} />
          <FormField label="Payment Terms" name="terms" readOnly={readOnly} />
          <FormField label="Shipping Address" name="shipping" readOnly={readOnly} />
          <FormField label="Tax Rate (%)" name="tax" readOnly={readOnly} />
        </div>
      </div>
    );
  }
  if (screen.startsWith("inventory")) {
    return (
      <div className="border-t border-gray-100 pt-3">
        <h3 className="mb-2 text-sm font-bold text-[#3B5295]">Inventory Details</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <FormField label="Warehouse Location" name="warehouse" readOnly={readOnly} />
          <FormField label="SKU / Item Code" name="sku" readOnly={readOnly} />
          <FormField label="Reorder Level" name="reorder" readOnly={readOnly} />
          <FormField label="Unit Price" name="price" readOnly={readOnly} />
        </div>
      </div>
    );
  }
  if (screen.startsWith("finance") || screen.startsWith("account")) {
    return (
      <div className="border-t border-gray-100 pt-3">
        <h3 className="mb-2 text-sm font-bold text-[#3B5295]">Financial Details</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <FormField label="Bank Account" name="bank" readOnly={readOnly} />
          <FormField label="Transaction Type" name="type" readOnly={readOnly} />
          <FormField label="Currency" name="currency" readOnly={readOnly} />
          <FormField label="Reference No" name="ref" readOnly={readOnly} />
        </div>
      </div>
    );
  }
  if (screen.startsWith("hr")) {
    return (
      <div className="border-t border-gray-100 pt-3">
        <h3 className="mb-2 text-sm font-bold text-[#3B5295]">HR Details</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <FormField label="Employee ID" name="empId" readOnly={readOnly} />
          <FormField label="Department" name="department" readOnly={readOnly} />
          <FormField label="Designation" name="designation" readOnly={readOnly} />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-700">Joining Date</span>
            <input type="date" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-50" disabled={readOnly} />
          </label>
        </div>
      </div>
    );
  }
  return null;
}

function RecordModal({
  modal,
  onClose,
  onDelete,
  onSave,
  page
}: {
  modal: ModalState;
  onClose: () => void;
  onDelete: (row: Row) => void;
  onSave: (row: Row) => void;
  page: ModulePage;
}) {
  if (!modal) return null;

  const existing = modal.mode === "create"
    ? {
        id: `${page.screen.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-5)}`,
        owner: "Automation",
        primary: "",
        secondary: "",
        status: "Draft",
        value: ""
      }
    : modal.row;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: String(form.get("id") ?? existing.id),
      owner: String(form.get("owner") ?? existing.owner),
      primary: String(form.get("primary") ?? existing.primary),
      secondary: String(form.get("secondary") ?? existing.secondary),
      status: String(form.get("status") ?? existing.status),
      value: String(form.get("value") ?? existing.value)
    });
  }

  const readOnly = modal.mode === "view";
  const isDelete = modal.mode === "delete";
  const title = modal.mode === "create" ? page.action : modal.mode === "edit" ? `Edit ${existing.id}` : modal.mode === "view" ? `View ${existing.id}` : `Delete ${existing.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-sm sm:p-4">
      <div className="my-auto w-full max-w-xl rounded-xl bg-white p-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{page.title}</p>
            <h2 className="mt-1 text-lg font-bold text-primary">{title}</h2>
          </div>
          <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-primary" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {isDelete ? (
          <div className="py-6">
            <p className="text-sm leading-6 text-gray-700">Delete record <strong>{existing.id}</strong>? This removes it from the current frontend session.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClose}>Cancel</button>
              <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700" onClick={() => onDelete(existing)}>Delete</button>
            </div>
          </div>
        ) : (
          <form className="pt-3" onSubmit={submit}>
            <div className="grid gap-3">
              <div className="grid gap-2 md:grid-cols-2">
                <FormField defaultValue={existing.id} label="Record ID" name="id" readOnly={readOnly || modal.mode === "edit"} />
                <FormField defaultValue={existing.status} label="Status" name="status" readOnly={readOnly} />
                <FormField defaultValue={existing.primary} label={page.columns[1] ?? "Record"} name="primary" readOnly={readOnly} />
                <FormField defaultValue={existing.secondary} label={page.columns[2] ?? "Context"} name="secondary" readOnly={readOnly} />
                <FormField defaultValue={existing.value} label={page.columns[3] ?? "Value"} name="value" readOnly={readOnly} />
                <FormField defaultValue={existing.owner} label={page.columns[4] ?? "Owner"} name="owner" readOnly={readOnly} />
              </div>

              <ModuleSpecificFields screen={page.screen} readOnly={readOnly} />
              
              <div className="border-t border-gray-100 pt-3">
                <h3 className="mb-2 text-sm font-bold text-[#3B5295]">Detailed Specifications</h3>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-gray-700">Scope of Work / Remarks</span>
                  <textarea 
                    className="min-h-16 w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-50" 
                    placeholder="Enter detailed description..."
                    disabled={readOnly}
                  />
                </label>
              </div>

              <div className="grid gap-3 border-t border-gray-100 pt-3 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-bold text-[#3B5295]">Scheduling & Tracking</h3>
                  <div className="space-y-2">
                    <label className="block">
                      <span className="text-xs font-medium text-gray-700">Expected Start Date</span>
                      <input type="date" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-50" disabled={readOnly} />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-gray-700">Target Completion</span>
                      <input type="date" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-50" disabled={readOnly} />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-bold text-[#3B5295]">Attachments</h3>
                  <div className="flex h-[110px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#c7d6e6] bg-[#f8fafc] transition-colors hover:bg-[#eef3f8]">
                    <UploadCloud className="mb-1 text-[#3B5295]" size={20} />
                    <p className="text-xs font-semibold text-[#30447c]">Click or drag to upload files</p>
                    <p className="text-[10px] text-gray-500">PDF, Excel, Images up to 25MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
              <span className="text-xs font-semibold text-gray-400">Transaction log generated automatically.</span>
              <div className="flex gap-3">
                <button className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClose} type="button">{readOnly ? "Close Modal" : "Cancel"}</button>
                {!readOnly ? <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primaryDark" type="submit">Save & Commit</button> : null}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function FormField({ defaultValue = "", label, name, readOnly }: { defaultValue?: string; label: string; name: string; readOnly: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
        defaultValue={defaultValue}
        disabled={readOnly}
        name={name}
        required
      />
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  const danger = ["Delay Risk", "Blocked", "Escalated", "NCR", "Low", "Anomaly"];
  const warning = ["Pending", "Review", "GST Hold", "Renegotiate", "Expiring", "QC Hold", "Due", "Scheduled", "Invoice Due", "OT Review", "Geo Hold", "Open", "Expiry", "Learning", "Beta"];
  const success = ["Approved", "On Track", "Verified", "Active", "Preferred", "OK", "Posted", "Filed", "Closed", "Paid", "Live", "Sent", "Published", "Booked", "Synced", "Submitted"];
  const style = danger.includes(status)
    ? "bg-red-50 text-danger"
    : warning.includes(status)
      ? "bg-amber-50 text-warning"
      : success.includes(status)
        ? "bg-green-50 text-success"
        : "bg-blue-50 text-info";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{status}</span>;
}

function AdminUsersScreen({ rows, canMutate, onEdit, onDelete }: { rows: Row[]; canMutate: boolean; onEdit: (row: Row) => void; onDelete: (row: Row) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rows.map(row => (
        <div key={row.id} className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {row.primary.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{row.primary}</p>
                <p className="text-xs text-gray-500">{row.owner}</p>
              </div>
            </div>
            <StatusBadge status={row.status} />
          </div>
          <div className="mt-4 flex-1">
             <p className="text-sm text-gray-600"><span className="font-medium text-gray-500">Role:</span> {row.secondary}</p>
             <p className="text-sm text-gray-600 mt-1"><span className="font-medium text-gray-500">Last Login:</span> Today, 09:30 AM</p>
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
             <button disabled={!canMutate} onClick={() => onEdit(row)} className="flex-1 rounded border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">Edit Access</button>
             <button disabled={!canMutate} onClick={() => onDelete(row)} className="flex-1 rounded border border-red-100 bg-red-50 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50">Revoke</button>
          </div>
        </div>
      ))}
      <div className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-[#3B5295] hover:bg-[#eef3f8] hover:text-[#30447c]">
        <Users size={24} className="mb-2" />
        <span className="text-sm font-semibold">Invite New User</span>
      </div>
    </div>
  );
}

function AdminBranchesScreen({ rows, canMutate, onEdit }: { rows: Row[]; canMutate: boolean; onEdit: (row: Row) => void; onDelete: (row: Row) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rows.map(row => (
        <div key={row.id} className="flex rounded-lg border border-gray-200 bg-white p-0 shadow-sm overflow-hidden">
          <div className="w-2 bg-[#1B3A6B]"></div>
          <div className="flex-1 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#3B5295] text-lg">{row.primary}</p>
                <p className="text-sm text-gray-500 mt-0.5">{row.secondary}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
               <div className="rounded bg-gray-50 p-2 text-center">
                 <p className="text-xs text-gray-500 font-medium">Headcount</p>
                 <p className="text-lg font-bold text-gray-800">{Math.floor(Math.random() * 200) + 50}</p>
               </div>
               <div className="rounded bg-gray-50 p-2 text-center">
                 <p className="text-xs text-gray-500 font-medium">Active Projects</p>
                 <p className="text-lg font-bold text-gray-800">{Math.floor(Math.random() * 5) + 1}</p>
               </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
               <button disabled={!canMutate} onClick={() => onEdit(row)} className="text-sm font-medium text-[#3B5295] hover:underline disabled:opacity-50">Manage Branch</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminDepartmentsScreen({ rows, canMutate, onEdit }: { rows: Row[]; canMutate: boolean; onEdit: (row: Row) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rows.map(row => (
        <div key={row.id} className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{row.secondary}</span>
            <StatusBadge status={row.status} />
          </div>
          <p className="font-bold text-[#3B5295] text-base">{row.primary}</p>
          <p className="text-xs text-gray-500 mt-1">Head: {row.owner}</p>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs font-semibold text-gray-500">{row.value}</span>
            <button disabled={!canMutate} onClick={() => onEdit(row)} className="text-xs font-medium text-[#3B5295] hover:underline disabled:opacity-40">Edit</button>
          </div>
        </div>
      ))}
      <div className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-[#3B5295] hover:bg-[#eef3f8] hover:text-[#3B5295]">
        <span className="text-2xl mb-1">+</span><span className="text-sm font-semibold">Add Department</span>
      </div>
    </div>
  );
}

function AdminRolesScreen({ rows, canMutate, onEdit }: { rows: Row[]; canMutate: boolean; onEdit: (row: Row) => void }) {
  const roleData = [
    { id: "ROLE-01", name: "System Administrator", level: 100, scope: "All Modules", users: "1", color: "#1B3A6B" },
    { id: "ROLE-02", name: "Project Director", level: 80, scope: "Projects, Finance, Reports", users: "0", color: "#2B6CB0" },
    { id: "ROLE-03", name: "Project Manager", level: 60, scope: "Projects, Procurement, Labour", users: "0", color: "#3B5295" },
    { id: "ROLE-04", name: "Site Engineer", level: 40, scope: "DPR, Quality, Safety", users: "0", color: "#4A6FA5" },
    { id: "ROLE-05", name: "Store Keeper", level: 30, scope: "Inventory, GRN, Gate Pass", users: "0", color: "#C9A84C" },
    { id: "ROLE-06", name: "Accounts Officer", level: 40, scope: "Finance, Payroll, GST", users: "0", color: "#2F855A" },
    { id: "ROLE-07", name: "HR Manager", level: 50, scope: "HRMS, Labour, Payroll", users: "0", color: "#805AD5" },
    { id: "ROLE-08", name: "Safety Officer", level: 35, scope: "Safety, Inspection", users: "0", color: "#DD6B20" },
    { id: "ROLE-09", name: "Auditor (Read-Only)", level: 10, scope: "All Modules (Read)", users: "0", color: "#718096" },
  ];
  return (
    <div className="space-y-3">
      {roleData.map(role => (
        <div key={role.id} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="w-1.5 self-stretch rounded-full" style={{ backgroundColor: role.color }} />
          <div className="flex-1">
            <p className="font-bold text-gray-800">{role.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">Scope: {role.scope}</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-gray-400">Access Level</p>
            <p className="text-lg font-bold text-[#3B5295]">{role.level}</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-gray-400">Users</p>
            <p className="text-lg font-bold text-gray-700">{role.users}</p>
          </div>
          <button disabled={!canMutate} onClick={() => onEdit({ id: role.id, primary: role.name, secondary: role.scope, owner: "Admin", status: "Active", value: String(role.level) })} className="text-xs font-medium text-[#3B5295] border border-[#3B5295] rounded px-3 py-1.5 hover:bg-[#eef3f8] disabled:opacity-40">Configure</button>
        </div>
      ))}
    </div>
  );
}

function AdminPermissionsScreen({ canMutate }: { canMutate: boolean }) {
  const modules = ["Projects","Procurement","Inventory","Finance","HR & Payroll","Quality","Safety","CRM","Contracts","Documents","Analytics","Admin"];
  const perms = ["View","Create","Edit","Delete","Approve","Export"];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-xs">
        <thead>
          <tr className="bg-[#f8fafc] border-b border-gray-200">
            <th className="px-4 py-3 text-left font-bold text-gray-600">Module</th>
            {perms.map(p => <th key={p} className="px-3 py-3 text-center font-bold text-gray-600">{p}</th>)}
          </tr>
        </thead>
        <tbody>
          {modules.map((mod, i) => (
            <tr key={mod} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
              <td className="px-4 py-3 font-semibold text-gray-800">{mod}</td>
              {perms.map(p => (
                <td key={p} className="px-3 py-3 text-center">
                  <input type="checkbox" defaultChecked={mod === "Admin" ? p === "View" : true} disabled={!canMutate} className="accent-[#3B5295] w-4 h-4" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 border-t border-gray-100 flex justify-end">
        <button disabled={!canMutate} className="rounded-md bg-[#3B5295] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1B3A6B] disabled:opacity-40">Save Permission Matrix</button>
      </div>
    </div>
  );
}

function AdminApprovalMatrixScreen({ rows, canMutate }: { rows: Row[]; canMutate: boolean }) {
  const matrix = [
    { id: "APM-001", type: "Purchase Order", l1: "Site Engineer", l2: "Project Manager", l3: "VP – Commercial", threshold: "> Rs 5L", status: "Active" },
    { id: "APM-002", type: "Material Requisition", l1: "Store Keeper", l2: "Project Manager", l3: "—", threshold: "All", status: "Active" },
    { id: "APM-003", type: "Payment Request", l1: "Accounts Officer", l2: "CFO", l3: "MD", threshold: "> Rs 10L", status: "Active" },
    { id: "APM-004", type: "Leave Application", l1: "Reporting Manager", l2: "HR Manager", l3: "—", threshold: "> 5 days", status: "Active" },
    { id: "APM-005", type: "Work Order", l1: "Project Manager", l2: "Director – Projects", l3: "—", threshold: "> Rs 25L", status: "Active" },
    { id: "APM-006", type: "Vendor Registration", l1: "Procurement Head", l2: "VP – Commercial", l3: "—", threshold: "All", status: "Active" },
    { id: "APM-007", type: "CAPEX Request", l1: "Dept. Head", l2: "CFO", l3: "Board", threshold: "> Rs 50L", status: "Active" },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-xs">
        <thead>
          <tr className="bg-[#f8fafc] border-b border-gray-200">
            {["Type","Level 1","Level 2","Level 3","Threshold","Status",""].map(h => <th key={h} className="px-4 py-3 text-left font-bold text-gray-600">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
              <td className="px-4 py-3 font-semibold text-gray-800">{row.type}</td>
              <td className="px-4 py-3 text-gray-600">{row.l1}</td>
              <td className="px-4 py-3 text-gray-600">{row.l2}</td>
              <td className="px-4 py-3 text-gray-400">{row.l3}</td>
              <td className="px-4 py-3 font-medium text-[#3B5295]">{row.threshold}</td>
              <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
              <td className="px-4 py-3"><button disabled={!canMutate} className="text-xs text-[#3B5295] hover:underline disabled:opacity-40">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminAuditLogsScreen({ rows }: { rows: Row[] }) {
  const logs = [
    { id: "AUD-001", action: "User Login", user: "it@bcim.in", module: "Auth", ip: "192.168.1.10", time: "Today, 09:30 AM", status: "Success" },
    { id: "AUD-002", action: "Role Created", user: "it@bcim.in", module: "Admin", ip: "192.168.1.10", time: "Today, 09:31 AM", status: "Success" },
    { id: "AUD-003", action: "Settings Updated", user: "it@bcim.in", module: "Admin", ip: "192.168.1.10", time: "Today, 09:35 AM", status: "Success" },
  ];
  const display = rows.length > 0 ? rows.map(r => ({ id: r.id, action: r.primary, user: r.owner, module: r.secondary, ip: "—", time: r.value, status: r.status })) : logs;
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-[#f8fafc] border-b border-gray-200 flex items-center justify-between">
        <p className="text-sm font-bold text-gray-700">Audit Trail</p>
        <button className="text-xs text-[#3B5295] font-semibold hover:underline">Export CSV</button>
      </div>
      <table className="min-w-full text-xs">
        <thead><tr className="border-b border-gray-100">{["Event","User","Module","IP Address","Timestamp","Result"].map(h => <th key={h} className="px-4 py-3 text-left font-bold text-gray-500">{h}</th>)}</tr></thead>
        <tbody>
          {display.map((log, i) => (
            <tr key={log.id} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
              <td className="px-4 py-3 font-medium text-gray-800">{log.action}</td>
              <td className="px-4 py-3 text-gray-600">{log.user}</td>
              <td className="px-4 py-3 text-gray-500">{log.module}</td>
              <td className="px-4 py-3 text-gray-400 font-mono">{log.ip}</td>
              <td className="px-4 py-3 text-gray-500">{log.time}</td>
              <td className="px-4 py-3"><StatusBadge status={log.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminSystemSettingsScreen({ canMutate }: { canMutate: boolean }) {
  const sections = [
    { label: "Organisation Name", value: "BCIM Infrastructure Pvt Ltd", type: "text" },
    { label: "CIN / Registration No.", value: "U45200MH2010PTC123456", type: "text" },
    { label: "GST Number", value: "27AABCB1234A1Z5", type: "text" },
    { label: "Financial Year Start", value: "April", type: "select" },
    { label: "Default Currency", value: "INR (₹)", type: "select" },
    { label: "Time Zone", value: "Asia/Kolkata (IST)", type: "select" },
    { label: "Date Format", value: "DD/MM/YYYY", type: "select" },
    { label: "SMTP Server", value: "smtp.bcim.in", type: "text" },
    { label: "Support Email", value: "it@bcim.in", type: "text" },
    { label: "Audit Retention (Days)", value: "90", type: "number" },
    { label: "Session Timeout (Minutes)", value: "30", type: "number" },
    { label: "MFA Enforcement", value: "Enabled", type: "toggle" },
  ];
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {sections.map(s => (
        <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-2">{s.label}</p>
          {s.type === "toggle" ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-5 rounded-full bg-[#3B5295] relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" /></div>
              <span className="text-sm font-semibold text-[#3B5295]">{s.value}</span>
            </div>
          ) : (
            <input type={s.type === "number" ? "number" : "text"} defaultValue={s.value} disabled={!canMutate} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 focus:border-[#3B5295] focus:outline-none disabled:bg-gray-50" />
          )}
        </div>
      ))}
      <div className="md:col-span-2 flex justify-end">
        <button disabled={!canMutate} className="rounded-lg bg-[#3B5295] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#1B3A6B] disabled:opacity-40">Save Settings</button>
      </div>
    </div>
  );
}

function MobileDprScreen({ canMutate, page }: { canMutate: boolean; page: ModulePage }) {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f9] rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-[#3B5295] text-white p-5">
        <h1 className="text-xl font-bold">Daily Progress Report</h1>
        <p className="text-xs opacity-75 flex items-center gap-1 mt-1"><MapPin size={12} /> Zone B - Metro Tunnel</p>
      </div>
      <div className="p-4 space-y-4 flex-1 overflow-auto bg-white">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">Labour Count</h2>
          <div className="grid grid-cols-2 gap-3">
             <input type="number" placeholder="Skilled" className="border border-gray-300 rounded-lg p-3 text-sm w-full bg-white focus:outline-none focus:border-[#3B5295]" />
             <input type="number" placeholder="Unskilled" className="border border-gray-300 rounded-lg p-3 text-sm w-full bg-white focus:outline-none focus:border-[#3B5295]" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">Work Completed</h2>
          <textarea placeholder="Describe work done today..." rows={3} className="border border-gray-300 rounded-lg p-3 text-sm w-full bg-white focus:outline-none focus:border-[#3B5295]" />
        </div>
        <div className="bg-teal-50 rounded-xl p-4 flex flex-col items-center justify-center py-8 border-dashed border-2 border-teal-200 hover:bg-teal-100 active:bg-teal-200 cursor-pointer text-[#30447c] transition-colors">
           <Camera size={32} className="mb-2 opacity-80" />
           <span className="text-sm font-semibold">Snap Site Photo</span>
        </div>
        <button disabled={!canMutate} className="w-full bg-[#3B5295] text-white rounded-xl py-3.5 font-bold shadow-md hover:bg-[#159385] active:scale-95 transition-all mt-4 disabled:opacity-50">Submit DPR</button>
      </div>
    </div>
  );
}

function MobileGatePassScreen({ canMutate, page }: { canMutate: boolean; page: ModulePage }) {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f9] rounded-xl border border-[#d7e1ec] overflow-hidden shadow-sm">
      <div className="bg-[#3B5295] text-white p-5">
        <h1 className="text-xl font-bold">Gate Entry / Inward</h1>
        <p className="text-xs opacity-75 flex items-center gap-1 mt-1"><Truck size={12} /> Material Receiving Desk</p>
      </div>
      <div className="p-4 space-y-4 flex-1 overflow-auto bg-white">
        <div className="bg-gradient-to-br from-[#3B5295] to-[#30447c] rounded-xl p-8 shadow-md text-white text-center cursor-pointer active:scale-95 transition-all hover:shadow-lg">
           <ScanLine size={48} className="mx-auto mb-3 opacity-90" />
           <h2 className="font-bold text-lg">Scan Delivery Challan</h2>
           <p className="text-xs opacity-80 mt-1">AI will extract PO and Material Details</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mt-6">
           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Or enter manually</p>
           <div className="space-y-3">
             <input type="text" placeholder="PO Number" className="border border-gray-300 rounded-lg p-3 text-sm w-full bg-white focus:outline-none focus:border-[#3B5295]" />
             <input type="text" placeholder="Vehicle Number" className="border border-gray-300 rounded-lg p-3 text-sm w-full bg-white focus:outline-none focus:border-[#3B5295]" />
           </div>
           <button disabled={!canMutate} className="w-full bg-primary text-white rounded-lg py-3 font-semibold mt-4 disabled:opacity-50 hover:bg-primaryDark">Record Entry</button>
        </div>
      </div>
    </div>
  );
}

function MobileQaQcScreen({ canMutate, page }: { canMutate: boolean; page: ModulePage }) {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f9] rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-[#0f766e] text-white p-5">
        <h1 className="text-xl font-bold">QA/QC Checklists</h1>
        <p className="text-xs opacity-75 mt-1">Pending Inspections</p>
      </div>
      <div className="p-4 space-y-3 flex-1 overflow-auto bg-white">
         {[
           { id: "Q-101", task: "Concrete Pour: Foundation", loc: "Block A", status: "pending" },
           { id: "Q-102", task: "Rebar Binding", loc: "Block B, Floor 2", status: "pending" },
           { id: "Q-103", task: "Waterproofing", loc: "Basement", status: "pass" },
         ].map((item) => (
           <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center justify-between transition-colors hover:border-teal-200">
              <div>
                <p className="font-bold text-gray-800 text-sm">{item.task}</p>
                <p className="text-xs text-gray-500 mt-1">{item.id} &bull; {item.loc}</p>
              </div>
              {item.status === "pending" ? (
                <button className="bg-gray-100 p-2.5 rounded-lg text-gray-600 active:bg-teal-50 active:text-teal-600 transition-colors">
                  <CheckSquare size={20} />
                </button>
              ) : (
                <span className="text-[#0f766e] bg-teal-50 px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wider">PASSED</span>
              )}
           </div>
         ))}
      </div>
    </div>
  );
}

function AiCockpitScreen() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<AiChatMessage[]>([
    { role: "assistant", content: "Hello! I'm the NirmaanCloud AI assistant. How can I help you manage your construction operations today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [ocrFile, setOcrFile] = useState("");
  const [ocrResult, setOcrResult] = useState<AiOcrResult | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function handleChat(e: FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessages: AiChatMessage[] = [...messages, { role: "user", content: chatInput }];
    setMessages(newMessages);
    setChatInput("");
    setLoading(true);
    try {
      const res = await aiChat(DEFAULT_TENANT_ID, newMessages);
      setMessages(curr => [...curr, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages(curr => [...curr, { role: "assistant", content: "Sorry, I am currently offline. Operating in demo fallback mode." }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleOcr(e: FormEvent) {
    e.preventDefault();
    setOcrResult(null);
    try {
      const res = await aiOcr(DEFAULT_TENANT_ID, ocrFile);
      setOcrResult(res);
    } catch {
      alert("OCR processing failed. Check API connection.");
    }
  }

  return (
    <div className="grid h-[calc(100vh-140px)] gap-6 lg:grid-cols-[1fr_400px]">
      <div className="flex flex-col gap-6 overflow-y-auto pr-2">
        <section className="rounded-xl border border-[#d7e1ec] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 text-[#3B5295]">
            <Bot size={24} />
            <h2 className="text-xl font-bold text-[#3B5295]">OCR Invoice Extraction Agent</h2>
          </div>
          <p className="mb-6 text-sm text-gray-600">Upload vendor invoices for automatic extraction, GSTIN validation, and three-way matching against POs.</p>
          <form onSubmit={handleOcr} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter mock filename (e.g. ultratech_cement_invoice.pdf)"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#3B5295] focus:outline-none focus:ring-1 focus:ring-[#3B5295]"
              value={ocrFile}
              onChange={e => setOcrFile(e.target.value)}
              required
            />
            <button className="flex items-center gap-2 rounded-lg bg-[#3B5295] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1a4a8c]">
              <ScanLine size={16} /> Extract Data
            </button>
          </form>

          {ocrResult && (
            <div className="mt-6 rounded-xl border border-[#d7e1ec] bg-gray-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-[#3B5295]">{ocrResult.vendorName}</span>
                <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-bold text-[#30447c]">Confidence: {(ocrResult.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div><p className="text-xs text-gray-500">Invoice No</p><p className="font-semibold text-gray-900">{ocrResult.invoiceNumber}</p></div>
                <div><p className="text-xs text-gray-500">Date</p><p className="font-semibold text-gray-900">{ocrResult.invoiceDate}</p></div>
                <div><p className="text-xs text-gray-500">GSTIN</p><p className="font-semibold text-gray-900">{ocrResult.gstin}</p></div>
                <div><p className="text-xs text-gray-500">Total Amount</p><p className="font-semibold text-gray-900">₹ {ocrResult.totalAmount.toLocaleString()}</p></div>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <table className="w-full text-left text-sm">
                  <thead><tr className="text-gray-500"><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
                  <tbody>
                    {ocrResult.lineItems.map((item, i) => (
                      <tr key={i} className="border-t border-gray-100"><td className="py-2">{item.description}</td><td>{item.qty}</td><td>₹ {item.rate}</td><td>₹ {item.amount}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[#d7e1ec] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 text-[#3B5295]">
            <BarChart3 size={24} />
            <h2 className="text-xl font-bold text-[#3B5295]">Predictive Cashflow Forecast</h2>
          </div>
          <div className="h-64 rounded-lg border border-dashed border-[#d7e1ec] bg-gray-50 p-4">
             {/* Stub for recharts line chart showing forecast */}
             <div className="flex h-full items-center justify-center text-sm text-gray-400">Cashflow forecast chart will render here based on active POs and billing milestones.</div>
          </div>
        </section>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-[#d7e1ec] bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-[#3B5295] p-4 text-white">
          <div className="flex items-center gap-3">
            <Bot size={20} className="text-[#3B5295]" />
            <div>
              <h3 className="font-bold">NirmaanCloud Assistant</h3>
              <p className="text-xs text-white/60">Ask about projects, delays, POs, or labour</p>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-[#3B5295] text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-none border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                <div className="flex gap-1"><span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" /><span className="h-2 w-2 animate-bounce rounded-full bg-gray-300 delay-75" /><span className="h-2 w-2 animate-bounce rounded-full bg-gray-300 delay-150" /></div>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        <div className="border-t border-gray-100 bg-white p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {["Delay risk on Skyline?", "Open POs?", "Cashflow runway?"].map(preset => (
              <button key={preset} onClick={() => setChatInput(preset)} className="rounded-full border border-[#d7e1ec] bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100">{preset}</button>
            ))}
          </div>
          <form onSubmit={handleChat} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#3B5295] focus:outline-none"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <button disabled={loading || !chatInput.trim()} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B5295] text-white disabled:opacity-50">
              <SendHorizonal size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-14 w-full rounded-lg bg-gray-200/50"></div>
      <div className="h-48 w-full rounded-lg bg-gray-200/50"></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="h-28 rounded-lg border border-gray-100 bg-gray-100/50"></div>
        <div className="h-28 rounded-lg border border-gray-100 bg-gray-100/50"></div>
        <div className="h-28 rounded-lg border border-gray-100 bg-gray-100/50"></div>
        <div className="h-28 rounded-lg border border-gray-100 bg-gray-100/50"></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-96 rounded-lg border border-gray-100 bg-gray-100/50"></div>
        <div className="space-y-6">
          <div className="h-40 rounded-lg border border-gray-100 bg-gray-100/50"></div>
          <div className="h-64 rounded-lg border border-gray-100 bg-gray-100/50"></div>
        </div>
      </div>
    </div>
  );
}


