const icons = {
  grid: '<svg viewBox="0 0 24 24"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24"><path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 12h18"/></svg>',
  box: '<svg viewBox="0 0 24 24"><path d="m21 16-9 5-9-5V8l9-5 9 5Z"/><path d="m3.3 7.6 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>'
};

const navItems = [
  ["Executive cockpit", "grid"],
  ["CRM and sales", "users"],
  ["Projects", "chart"],
  ["Procurement", "briefcase"],
  ["Inventory", "box"],
  ["Finance and GST", "file"],
  ["Quality and safety", "shield"],
  ["Mobile apps", "phone"]
];

const modules = [
  ["Organization and Admin", "Multi-company, RBAC, SSO, audit logs, workflow builder, escalation routing.", "ai"],
  ["CRM and Lead Management", "WhatsApp leads, site visits, unit inventory, AI scoring, auto quotations.", "ai"],
  ["Tendering and Estimation", "BOQ, rate analysis, OCR tender import, AI cost and vendor comparison.", "ai"],
  ["Project Planning", "WBS, Gantt, DPR, dependencies, baselines, AI delay prediction.", "field"],
  ["Procurement", "MR, RFQ, vendor portal, PO, comparative statements, smart approvals.", "ai"],
  ["Inventory and Warehouse", "QR, RFID, gate pass, batch tracking, transfers, AI stock forecasting.", "field"],
  ["Contractor Management", "Work orders, MB, RA bills, retention, work certification, anomaly checks.", "finance"],
  ["Labour Management", "Biometric and geo attendance, shifts, wages, productivity analytics.", "field"],
  ["Plant and Machinery", "GPS, fuel tracking, utilization, service reminders, predictive maintenance.", "field"],
  ["QA/QC", "IRs, checklists, NCR, test reports, cube tracking, mobile inspections.", "field"],
  ["Safety EHS", "Permits, incidents, PPE, toolbox talks, risk alerts, compliance reminders.", "field"],
  ["Finance and Accounting", "GL, AP, AR, GST, TDS, e-invoice, e-way bill, AI cashflow.", "finance"],
  ["Payroll and HRMS", "PF, ESI, PT, payroll, leave, recruitment, automated onboarding.", "finance"],
  ["Document Management", "Drawings, OCR search, versioning, digital signatures, approvals.", "ai"],
  ["Customer Portal", "Booking status, payments, complaints, documents, WhatsApp updates.", "ai"],
  ["Asset and Facility", "Lifecycle, warranty, AMC, preventive and predictive maintenance.", "field"],
  ["BI and AI Analytics", "Profitability, cost overrun, resource utilization, drill-down dashboards.", "ai"],
  ["Workflow Automation", "No-code builder, SLA monitoring, triggers, conditional approvals.", "ai"],
  ["Mobile Applications", "Management, site engineer, labour, vendor, customer, offline-first.", "field"],
  ["Advanced AI Agents", "Chatbot, voice, OCR, forecasting, risk, procurement, reports.", "ai"]
];

const roleData = {
  Executive: {
    kpis: [["Revenue", "₹184.2 Cr", "+12.6%"], ["Project health", "86%", "+4 pts"], ["Delayed tasks", "128", "-18%"], ["Cash runway", "94 days", "+11 days"]],
    widgets: ["Revenue by business unit", "Project portfolio health", "Cashflow forecast", "Pending approvals by SLA"]
  },
  Project: {
    kpis: [["DPR completion", "91%", "+8%"], ["Budget variance", "3.8%", "-1.2%"], ["Open NCRs", "42", "-9"], ["Safety incidents", "3", "-2"]],
    widgets: ["Baseline vs actual", "Milestone risk", "Site photo intelligence", "Resource utilization"]
  },
  Finance: {
    kpis: [["GST liability", "₹6.8 Cr", "Ready"], ["Vendor dues", "₹22.4 Cr", "-7%"], ["AR outstanding", "₹41.1 Cr", "-5%"], ["OCR accuracy", "97.2%", "+2%"]],
    widgets: ["Cashflow prediction", "GST and TDS status", "AP approval queue", "Bank reconciliation"]
  },
  Site: {
    kpis: [["Labour present", "1,842", "+96"], ["Materials issued", "418 MT", "+6%"], ["DPR drafts", "27", "Auto"], ["Geo photos", "312", "+44"]],
    widgets: ["Today at site", "Material consumption", "Labour productivity", "Quality checklist status"]
  },
  Vendor: {
    kpis: [["Open RFQs", "18", "+4"], ["PO value", "₹9.7 Cr", "+16%"], ["Delivery SLA", "93%", "+3%"], ["Invoices paid", "₹2.1 Cr", "Today"]],
    widgets: ["RFQ response tracker", "Delivery schedule", "Invoice status", "Compliance documents"]
  },
  Customer: {
    kpis: [["Units booked", "624", "+22"], ["Collection", "₹18.2 Cr", "+9%"], ["Complaints open", "31", "-11"], ["Updates sent", "8,420", "Auto"]],
    widgets: ["Booking funnel", "Payment tracker", "Construction updates", "Service requests"]
  }
};

const approvals = [
  ["PO approval", "TMT steel, ₹1.42 Cr, routed to CFO"],
  ["RA bill", "Shivam Contractors, MB verified"],
  ["E-way bill", "Ready for GST portal push"],
  ["Safety permit", "Night concrete pour, Tower A"]
];

const integrations = [
  "GST APIs", "E-Invoice", "E-Way Bill", "Aadhaar", "PAN", "UPI", "Razorpay", "Tally", "WhatsApp", "Maps", "Microsoft 365", "Google Workspace", "RFID", "IoT", "Biometric"
];

const reports = [
  "DPR", "Project profitability", "GST reports", "Labour productivity", "Inventory aging", "Vendor performance", "Delay analysis", "Equipment utilization", "PDF", "Excel", "Email automation"
];

const insightText = [
  "Forecast says Tower B may slip 11 days unless shuttering crew capacity improves this week.",
  "AI found 3 vendor invoices with rate variance above approved PO tolerance.",
  "Concrete cube test reminders are scheduled automatically for tomorrow's pours.",
  "Cashflow model recommends delaying two non-critical purchase orders by 9 days."
];

const navList = document.querySelector("#navList");
const moduleGrid = document.querySelector("#moduleGrid");
const kpiGrid = document.querySelector("#kpiGrid");
const widgetGrid = document.querySelector("#widgetGrid");
const approvalList = document.querySelector("#approvalList");
const integrationGrid = document.querySelector("#integrationGrid");
const reportChips = document.querySelector("#reportChips");
const roleTitle = document.querySelector("#roleTitle");

navList.innerHTML = navItems.map(([label, icon], index) => `
  <button class="nav-item ${index === 0 ? "active" : ""}">
    ${icons[icon]}
    <span>${label}</span>
  </button>
`).join("");

function renderModules(filter = "all") {
  const visible = filter === "all" ? modules : modules.filter((module) => module[2] === filter);
  moduleGrid.innerHTML = visible.map(([title, body, tag], index) => `
    <article class="module-card">
      <header>
        <span class="module-icon">${icons[["grid", "chart", "briefcase", "shield"][index % 4]]}</span>
        <span class="tag">${tag.toUpperCase()}</span>
      </header>
      <h3>${title}</h3>
      <p>${body}</p>
      <span class="tag">Automated workflow</span>
    </article>
  `).join("");
}

function renderRole(role) {
  const data = roleData[role];
  roleTitle.textContent = `${role} dashboard`;
  kpiGrid.innerHTML = data.kpis.map(([label, value, trend]) => `
    <article class="kpi-card">
      <header>
        <span>${label}</span>
        <span class="trend">${trend}</span>
      </header>
      <strong>${value}</strong>
      <small class="muted">Synced across ERP, mobile, and approval workflows</small>
    </article>
  `).join("");

  widgetGrid.innerHTML = data.widgets.map((title, index) => `
    <article class="widget-card" draggable="true">
      <div class="section-heading compact-heading">
        <h2>${title}</h2>
        <span class="tag">AI</span>
      </div>
      ${index % 3 === 0 ? barChart() : index % 3 === 1 ? donutChart() : timeline()}
    </article>
  `).join("");
  enableDrag();
}

function barChart() {
  return `<div class="chart-bars">${[42, 70, 58, 82, 46, 94, 68, 76].map((height) => `<span style="height:${height}%"></span>`).join("")}</div>`;
}

function donutChart() {
  return `<div class="donut"><span>86%</span></div><p class="muted">AI score blends schedule, cost, quality, safety, procurement, and cashflow.</p>`;
}

function timeline() {
  return `<div class="timeline">
    <span>Planning <i style="width:88%"></i></span>
    <span>Procure <i style="width:64%"></i></span>
    <span>Execute <i style="width:76%"></i></span>
    <span>Bill <i style="width:52%"></i></span>
  </div>`;
}

function enableDrag() {
  let dragged = null;
  widgetGrid.querySelectorAll(".widget-card").forEach((card) => {
    card.addEventListener("dragstart", () => {
      dragged = card;
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      dragged = null;
      card.classList.remove("dragging");
    });
    card.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (dragged && dragged !== card) {
        const cards = [...widgetGrid.children];
        const from = cards.indexOf(dragged);
        const to = cards.indexOf(card);
        widgetGrid.insertBefore(dragged, from < to ? card.nextSibling : card);
      }
    });
  });
}

approvalList.innerHTML = approvals.map(([title, detail]) => `
  <div class="approval-item">
    <span>
      <strong>${title}</strong>
      <small>${detail}</small>
    </span>
    <button class="secondary-button compact">Approve</button>
  </div>
`).join("");

integrationGrid.innerHTML = integrations.map((item) => `<div class="integration-tile">${item}</div>`).join("");
reportChips.innerHTML = reports.map((item) => `<span>${item}</span>`).join("");
renderModules();
renderRole("Executive");

document.querySelectorAll(".role-pill").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".role-pill").forEach((pill) => pill.classList.remove("active"));
    button.classList.add("active");
    renderRole(button.dataset.role);
  });
});

document.querySelectorAll(".segment-control button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segment-control button").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    renderModules(button.dataset.filter);
  });
});

document.querySelector("#themeToggle").addEventListener("click", () => {
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
});

document.querySelector("#menuToggle").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

document.querySelector("#globalSearch").addEventListener("input", (event) => {
  const term = event.target.value.toLowerCase();
  document.querySelectorAll(".module-card").forEach((card) => {
    card.style.display = card.textContent.toLowerCase().includes(term) ? "" : "none";
  });
});

let insightIndex = 0;
setInterval(() => {
  insightIndex = (insightIndex + 1) % insightText.length;
  document.querySelector("#aiInsight").textContent = insightText[insightIndex];
}, 4200);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
