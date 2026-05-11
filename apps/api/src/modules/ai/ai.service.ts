import { Injectable } from "@nestjs/common";

export interface OcrResult {
  invoiceNumber: string;
  invoiceDate: string;
  vendorName: string;
  gstin: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  lineItems: Array<{ description: string; qty: number; rate: number; amount: number }>;
  confidence: number;
  processingTimeMs: number;
}

export interface ForecastResult {
  domain: string;
  horizon: string;
  predictions: Array<{ period: string; value: number; confidence: number; signal: string }>;
  riskFlags: string[];
  recommendation: string;
  modelVersion: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResult {
  reply: string;
  citations: string[];
  suggestedActions: string[];
  confidence: number;
}

export interface AiInsight {
  id: string;
  domain: string;
  severity: "info" | "warning" | "critical";
  title: string;
  summary: string;
  affectedModule: string;
  timestamp: string;
  actionRequired: boolean;
}

@Injectable()
export class AiService {
  processOcr(tenantId: string, fileName?: string): OcrResult {
    const baseAmount = 420000 + Math.floor(Math.random() * 380000);
    const cgst = Math.round(baseAmount * 0.09);
    const sgst = Math.round(baseAmount * 0.09);
    return {
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceDate: new Date(Date.now() - Math.random() * 15 * 86400000).toISOString().slice(0, 10),
      vendorName: ["UltraTech Cement Ltd", "Tata Steel Ltd", "Schneider Electric India", "Polycab Wires Ltd", "Asian Paints"][Math.floor(Math.random() * 5)],
      gstin: `27AABCU${Math.floor(1000 + Math.random() * 9000)}K${Math.floor(1 + Math.random() * 9)}Z${Math.floor(1 + Math.random() * 9)}`,
      taxableAmount: baseAmount,
      cgst,
      sgst,
      igst: 0,
      totalAmount: baseAmount + cgst + sgst,
      lineItems: [
        { description: fileName?.includes("cement") ? "OPC 53 Grade Cement (50 kg bags)" : "TMT Steel Fe500D (12mm)", qty: 200 + Math.floor(Math.random() * 300), rate: 380 + Math.floor(Math.random() * 120), amount: baseAmount * 0.6 },
        { description: "Freight & Transportation charges", qty: 1, rate: Math.round(baseAmount * 0.08), amount: Math.round(baseAmount * 0.08) },
        { description: "Loading / Unloading charges", qty: 1, rate: Math.round(baseAmount * 0.02), amount: Math.round(baseAmount * 0.02) }
      ],
      confidence: 0.91 + Math.random() * 0.07,
      processingTimeMs: 800 + Math.floor(Math.random() * 400)
    };
  }

  generateForecast(tenantId: string, domain: "cashflow" | "delay" | "procurement" | "labour"): ForecastResult {
    const forecasts: Record<string, ForecastResult> = {
      cashflow: {
        domain: "Finance",
        horizon: "90 days",
        predictions: [
          { period: "Week 1", value: 94, confidence: 0.96, signal: "Stable" },
          { period: "Week 2", value: 88, confidence: 0.93, signal: "Stable" },
          { period: "Week 3", value: 76, confidence: 0.89, signal: "Watch" },
          { period: "Week 4", value: 61, confidence: 0.85, signal: "Watch" },
          { period: "Week 6", value: 45, confidence: 0.79, signal: "Alert" },
          { period: "Week 8", value: 38, confidence: 0.74, signal: "Critical" },
          { period: "Week 10", value: 52, confidence: 0.71, signal: "Recovery" },
          { period: "Week 12", value: 68, confidence: 0.68, signal: "Stable" }
        ],
        riskFlags: ["Milestone billing gap at Skyline Heights (week 4-6)", "Tata Steel PO payment due week 3", "GSTR-3B outflow Rs 2.1Cr in week 2"],
        recommendation: "Accelerate milestone completion at Skyline Heights Tower B and raise demand letter to Maha Metro for Metro Depot Milestone 7 to bridge week 4–6 cashflow gap. Consider TReDS discounting on approved invoices.",
        modelVersion: "NCF-CashflowV2.1"
      },
      delay: {
        domain: "Projects",
        horizon: "60 days",
        predictions: [
          { period: "PRJ-001 Skyline Heights", value: 14, confidence: 0.88, signal: "Delay Risk" },
          { period: "PRJ-002 Metro Depot", value: 2, confidence: 0.91, signal: "On Track" },
          { period: "PRJ-003 Riverfront Villas", value: -5, confidence: 0.84, signal: "Ahead" },
          { period: "PRJ-004 Hospital Block", value: 8, confidence: 0.82, signal: "Watch" },
          { period: "PRJ-007 IT Park Civil", value: 22, confidence: 0.79, signal: "Critical" }
        ],
        riskFlags: ["Tower crane TC-8 utilisation dropped to 62% (target 85%)", "Steel rebar stock at 82 MT — below 3-week buffer", "Monsoon risk window opens in 18 days"],
        recommendation: "Issue immediate equipment performance notice for TC-8. Fast-track PO-1093 (Tata Steel) approval to ensure 180 MT buffer stock before monsoon window opens.",
        modelVersion: "NCF-DelayV1.8"
      },
      procurement: {
        domain: "Procurement",
        horizon: "45 days",
        predictions: [
          { period: "Week 1", value: 12400000, confidence: 0.94, signal: "Normal" },
          { period: "Week 2", value: 18600000, confidence: 0.91, signal: "High" },
          { period: "Week 3", value: 9800000, confidence: 0.88, signal: "Normal" },
          { period: "Week 4", value: 24200000, confidence: 0.85, signal: "Spike" },
          { period: "Week 6", value: 16400000, confidence: 0.81, signal: "Normal" }
        ],
        riskFlags: ["11 auto-PO drafts awaiting approval (total Rs 4.2Cr)", "3 rate contracts expiring in < 30 days", "Cement price index up 3.2% — lock rates now"],
        recommendation: "Approve 11 pending auto-PO drafts to avoid 8–12 day site delays. Renew UltraTech rate contract before 28 May expiry to lock current pricing.",
        modelVersion: "NCF-ProcV1.5"
      },
      labour: {
        domain: "Labour",
        horizon: "30 days",
        predictions: [
          { period: "Week 1", value: 4218, confidence: 0.97, signal: "Normal" },
          { period: "Week 2", value: 4080, confidence: 0.94, signal: "Slight drop" },
          { period: "Week 3", value: 3720, confidence: 0.88, signal: "Watch" },
          { period: "Week 4", value: 3450, confidence: 0.83, signal: "Alert" }
        ],
        riskFlags: ["Eid holiday window → 12% attendance drop expected week 3–4", "18 site engineer positions open — productivity risk", "OT hours at 686 this week — burnout risk flag"],
        recommendation: "Pre-plan Eid leave roster and arrange backup labour through 3 approved subcontractors. Fast-track 4 site engineer recruitments from shortlist.",
        modelVersion: "NCF-LabourV1.3"
      }
    };
    return forecasts[domain] ?? forecasts.cashflow;
  }

  chat(tenantId: string, messages: ChatMessage[], context?: string): ChatResult {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() ?? "";

    if (lastMessage.includes("cashflow") || lastMessage.includes("cash flow")) {
      return {
        reply: "Current cashflow runway is **94 days** based on approved billing schedules. Week 4–6 shows a gap risk of ~Rs 2.8Cr driven by a Skyline Heights milestone delay and Tata Steel payment. I recommend raising a demand letter to Maha Metro for Milestone 7 (Rs 6.2Cr) and initiating TReDS invoice discounting on 3 approved invoices worth Rs 3.1Cr.",
        citations: ["Finance Summary API", "Approval queue — apr-mil-7", "FinanceSummary.cashflowDays"],
        suggestedActions: ["View Cashflow Forecast", "Open Pending Approvals", "Generate Finance Report"],
        confidence: 0.92
      };
    }

    if (lastMessage.includes("delay") || lastMessage.includes("skyline") || lastMessage.includes("project")) {
      return {
        reply: "**Skyline Heights Tower B** (PRJ-001) carries the highest delay risk at **+14 days** against baseline. Root causes: Tower Crane TC-8 utilisation at 62% (target 85%), steel rebar stock below 3-week buffer, and concrete cube tests showing variance at grid B4. Recommend issuing an equipment performance notice and fast-tracking PO-1093 Tata Steel approval.",
        citations: ["PRJ-001 health score", "EQP-044 utilisation log", "QA cube test IR-7726"],
        suggestedActions: ["View Project Health", "Approve PO-1093", "Schedule Inspection IR-7726"],
        confidence: 0.89
      };
    }

    if (lastMessage.includes("po") || lastMessage.includes("purchase order") || lastMessage.includes("procurement")) {
      return {
        reply: "There are **6 POs pending director approval** worth Rs 4.6Cr total. Highest priority: PO-1093 Tata Steel (Rs 1.2Cr) — needed for Skyline Heights rebar buffer. 11 auto-PO drafts are ready in the system. 3 rate contracts expire within 30 days. Recommend approving PO-1093 and reviewing the auto-PO batch today.",
        citations: ["Approval queue API", "Procurement module — open POs", "Rate contract expiry alerts"],
        suggestedActions: ["Approve PO-1093", "View Auto-PO Drafts", "View Rate Contracts"],
        confidence: 0.94
      };
    }

    if (lastMessage.includes("gst") || lastMessage.includes("compliance") || lastMessage.includes("tax")) {
      return {
        reply: "**GSTR-2B reconciliation** for April 2026 is at 97% match. Outstanding mismatch: 3 invoices from Schneider Electric (Rs 28.4L) — vendor has not uploaded to GST portal yet. GSTR-3B due May 20. TDS return for Q4 FY25–26 due May 31. GST liability this period: **Rs 2.1Cr**.",
        citations: ["Finance module — GST-0426", "Compliance API — GSTR status", "TDS calendar"],
        suggestedActions: ["View GSTR Dashboard", "Send Vendor Reminder", "Download GSTR-3B Draft"],
        confidence: 0.91
      };
    }

    if (lastMessage.includes("ocr") || lastMessage.includes("invoice") || lastMessage.includes("scan")) {
      return {
        reply: "The OCR Invoice Agent has processed **1,284 documents** this period with 94% extraction accuracy. 8 invoices are pending manual review (low confidence < 75%). 3 invoices flagged for GSTIN mismatch. Average processing time: 1.1 seconds per document. Recommend reviewing the 8 pending items before GSTR-2B filing.",
        citations: ["AI Agent AIA-011", "OCR accuracy log", "GSTR-2B mismatch report"],
        suggestedActions: ["Review Pending Invoices", "View OCR Accuracy Report", "Open DMS Search"],
        confidence: 0.88
      };
    }

    if (lastMessage.includes("labour") || lastMessage.includes("attendance") || lastMessage.includes("worker")) {
      return {
        reply: "**4,218 workers** are present today across 12 active sites. Geo-fencing hold on 24 workers at Hospital Block (GPS anomaly). Metro Depot rebar crew at 686 OT hours this week — burnout threshold. Eid holiday week 3–4 will cause ~12% attendance drop. Recommend pre-rostering backup crews through 3 approved subcontractors.",
        citations: ["Labour attendance API", "Geo-fence alert log", "OT analytics"],
        suggestedActions: ["View Geo-Fence Alerts", "Plan Eid Roster", "Contact Subcontractors"],
        confidence: 0.93
      };
    }

    // Default contextual response
    const contextResponses: Record<string, ChatResult> = {
      finance: {
        reply: "Finance snapshot: **Rs 9.6Cr** vendor dues outstanding, **97%** GSTR-2B match for April, **1,286** bank lines reconciled. Cashflow runway is 94 days. 3 high-value payments scheduled this week. What would you like to drill into?",
        citations: ["Finance Summary API", "FinanceSummary model"],
        suggestedActions: ["View Finance Dashboard", "View Pending Payments", "Generate Finance Report"],
        confidence: 0.87
      },
      procurement: {
        reply: "Procurement overview: **64 open POs**, 11 auto-PO drafts ready for approval, 6.8% cost saving opportunity detected on cement RFQs. 3 rate contracts expiring soon. AI recommends approving PO batch and locking cement rates with UltraTech before 28 May.",
        citations: ["Procurement API", "Auto-PO engine log"],
        suggestedActions: ["Approve Auto-POs", "View Rate Contracts", "Create RFQ"],
        confidence: 0.90
      }
    };

    const contextKey = context?.toLowerCase();
    if (contextKey && contextResponses[contextKey]) return contextResponses[contextKey];

    return {
      reply: `Hello! I'm the NirmaanCloud AI assistant. I can help you with cashflow forecasts, project delay analysis, procurement recommendations, GST compliance, OCR invoice review, and labour analytics. What would you like to know about your construction operations?`,
      citations: [],
      suggestedActions: ["Check Cashflow Forecast", "View Project Health", "Review Pending Approvals"],
      confidence: 0.85
    };
  }

  getInsights(tenantId: string): AiInsight[] {
    return [
      {
        id: "INS-001",
        domain: "Finance",
        severity: "warning",
        title: "Cashflow gap predicted Week 4–6",
        summary: "Rs 2.8Cr gap between outflows and inflows projected for May week 4 to June week 2 based on current billing schedules.",
        affectedModule: "finance",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actionRequired: true
      },
      {
        id: "INS-002",
        domain: "Projects",
        severity: "critical",
        title: "Skyline Heights delay risk +14 days",
        summary: "Tower crane TC-8 underperformance and steel buffer shortage driving critical delay risk on PRJ-001.",
        affectedModule: "projects",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        actionRequired: true
      },
      {
        id: "INS-003",
        domain: "Procurement",
        severity: "info",
        title: "6.8% cost saving opportunity on cement",
        summary: "Comparative analysis of UltraTech vs ACC vs Ambuja rates shows 6.8% savings possible if rate contract is renegotiated before June.",
        affectedModule: "procurement",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        actionRequired: false
      },
      {
        id: "INS-004",
        domain: "Safety",
        severity: "critical",
        title: "Hot-work permit PTW-6021 SLA breach",
        summary: "Hot-work permit at Hospital Block has exceeded SLA by 4 hours without approval. Auto-escalated to Site EHS Manager.",
        affectedModule: "safety",
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        actionRequired: true
      },
      {
        id: "INS-005",
        domain: "Inventory",
        severity: "warning",
        title: "TMT Steel Fe500D below 3-week buffer",
        summary: "Current stock of 82 MT at Site Store A covers only 1.8 weeks at current consumption rate. Reorder point is 150 MT.",
        affectedModule: "inventory",
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        actionRequired: true
      },
      {
        id: "INS-006",
        domain: "Compliance",
        severity: "info",
        title: "GSTR-3B due in 11 days",
        summary: "April 2026 GSTR-3B filing deadline is May 20. Current GST liability: Rs 2.1Cr. 97% invoice matching complete.",
        affectedModule: "finance",
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        actionRequired: false
      },
      {
        id: "INS-007",
        domain: "Labour",
        severity: "info",
        title: "Eid attendance drop forecast",
        summary: "12% labour attendance drop expected in week 3–4 across all sites. Pre-rostering backup recommended.",
        affectedModule: "labour",
        timestamp: new Date(Date.now() - 25200000).toISOString(),
        actionRequired: false
      },
      {
        id: "INS-008",
        domain: "Quality",
        severity: "warning",
        title: "Concrete cube test variance at Metro Depot",
        summary: "3 of 12 cube samples from Metro Depot grid G7 show compressive strength 8% below M30 spec. NCR IR-7726 raised.",
        affectedModule: "quality",
        timestamp: new Date(Date.now() - 28800000).toISOString(),
        actionRequired: true
      }
    ];
  }
}
