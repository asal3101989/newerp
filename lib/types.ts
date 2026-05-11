export type IconName = "grid" | "users" | "chart" | "briefcase" | "box" | "shield" | "file" | "phone";

export type ModuleCategory = "ai" | "field" | "finance";

export type RoleName = "Executive" | "Project" | "Finance" | "Site" | "Vendor" | "Customer";

export type Kpi = {
  label: string;
  value: string;
  trend: string;
};

export type RoleDashboard = {
  kpis: Kpi[];
  widgets: string[];
};

export type ErpModule = {
  title: string;
  body: string;
  category: ModuleCategory;
};
