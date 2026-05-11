export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:7001/api/v1";
export const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? "T-1000";
const TOKEN_KEY = "nirmaancloud-access-token";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...authHeaders() }
  });
  if (!response.ok) throw new Error(`API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    method: "POST"
  });
  if (!response.ok) throw new Error(`API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    method: "PATCH"
  });
  if (!response.ok) throw new Error(`API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}

export async function loginToApi(input: { email: string; password: string; tenantId?: string }) {
  const response = await apiPost<{
    accessToken: string;
    tenant: unknown;
    user: { id: string; name: string; role: string; department: string; permissions: string[] };
  }>("/auth/login", {
    email: input.email,
    password: input.password,
    tenantId: input.tenantId ?? DEFAULT_TENANT_ID
  });
  if (typeof window !== "undefined") window.localStorage.setItem(TOKEN_KEY, response.accessToken);
  return response;
}

export function logoutFromApi() {
  if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY);
}

// ── AI helpers ─────────────────────────────────────────────────────────────────

export interface AiChatMessage { role: "user" | "assistant"; content: string }
export interface AiChatResult { reply: string; citations: string[]; suggestedActions: string[]; confidence: number }
export interface AiOcrResult {
  invoiceNumber: string; invoiceDate: string; vendorName: string; gstin: string;
  taxableAmount: number; cgst: number; sgst: number; igst: number; totalAmount: number;
  lineItems: Array<{ description: string; qty: number; rate: number; amount: number }>;
  confidence: number; processingTimeMs: number;
}
export interface AiForecastResult {
  domain: string; horizon: string;
  predictions: Array<{ period: string; value: number; confidence: number; signal: string }>;
  riskFlags: string[]; recommendation: string; modelVersion: string;
}
export interface AiInsight {
  id: string; domain: string; severity: "info" | "warning" | "critical";
  title: string; summary: string; affectedModule: string; timestamp: string; actionRequired: boolean;
}

export const aiChat = (tenantId: string, messages: AiChatMessage[], context?: string) =>
  apiPost<AiChatResult>(`/tenants/${tenantId}/ai/chat`, { messages, context });

export const aiOcr = (tenantId: string, fileName?: string) =>
  apiPost<AiOcrResult>(`/tenants/${tenantId}/ai/ocr`, { fileName });

export const aiForecast = (tenantId: string, domain: "cashflow" | "delay" | "procurement" | "labour") =>
  apiPost<AiForecastResult>(`/tenants/${tenantId}/ai/forecast`, { domain });

export const aiInsights = (tenantId: string) =>
  apiGet<AiInsight[]>(`/tenants/${tenantId}/ai/insights`);

// ── Compliance helpers ─────────────────────────────────────────────────────────

export interface GstValidationResult {
  gstin: string; valid: boolean; legalName?: string; tradeName?: string;
  registrationDate?: string; taxPayerType?: string; gstStatus?: string;
  state?: string; errorMessage?: string;
}
export interface GstrStatusResult {
  tenantId: string; period: string;
  gstr1: { filed: boolean; filingDate?: string; liability: number };
  gstr2b: { available: boolean; matchPercent: number; mismatchCount: number };
  gstr3b: { filed: boolean; dueDate: string; liability: number };
  tdsReturn: { filed: boolean; dueDate: string; amount: number };
  itcAvailable: number; netLiability: number;
}

export const validateGstin = (tenantId: string, gstin: string) =>
  apiPost<GstValidationResult>(`/tenants/${tenantId}/compliance/gst/validate`, { gstin });

export const generateEInvoice = (tenantId: string, invoiceData: Record<string, unknown>) =>
  apiPost<{ irn: string; ackNo: string; ackDate: string; qrCodeData: string; ewbNo?: string }>(
    `/tenants/${tenantId}/compliance/einvoice/generate`, invoiceData
  );

export const generateEWayBill = (tenantId: string, billData: Record<string, unknown>) =>
  apiPost<{ ewbNo: string; ewbDate: string; validUpto: string; alert?: string }>(
    `/tenants/${tenantId}/compliance/eway-bill/generate`, billData
  );

export const getGstrStatus = (tenantId: string) =>
  apiGet<GstrStatusResult>(`/tenants/${tenantId}/compliance/gstr/status`);

// ── Generic Record CRUD ────────────────────────────────────────────────────────

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    method: "DELETE"
  });
  if (!response.ok) throw new Error(`API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}

export interface GenericRecord {
  id: string;
  module: string;
  recordId: string;
  primary: string;
  secondary: string;
  value: string;
  owner: string;
  status: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchRecords = (tenantId: string, module: string) =>
  apiGet<GenericRecord[]>(`/tenants/${tenantId}/records/${encodeURIComponent(module)}`);

export const createRecord = (tenantId: string, module: string, data: { recordId: string; primary: string; secondary?: string; value?: string; owner?: string; status?: string }) =>
  apiPost<GenericRecord>(`/tenants/${tenantId}/records/${encodeURIComponent(module)}`, data);

export const updateRecord = (tenantId: string, module: string, id: string, data: Partial<{ recordId: string; primary: string; secondary: string; value: string; owner: string; status: string }>) =>
  apiPatch<GenericRecord>(`/tenants/${tenantId}/records/${encodeURIComponent(module)}/${id}`, data);

export const deleteRecord = (tenantId: string, module: string, id: string) =>
  apiDelete<GenericRecord>(`/tenants/${tenantId}/records/${encodeURIComponent(module)}/${id}`);
