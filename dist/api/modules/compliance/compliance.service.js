"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const STATE_CODES = {
    "27": "Maharashtra",
    "29": "Karnataka",
    "24": "Gujarat",
    "07": "Delhi",
    "33": "Tamil Nadu",
    "36": "Telangana",
    "09": "Uttar Pradesh",
    "06": "Haryana",
    "32": "Kerala",
    "08": "Rajasthan"
};
let ComplianceService = class ComplianceService {
    validateGstin(gstin) {
        // GSTIN format: 2-digit state code + 10-char PAN + 1-digit entity number + Z + 1 checksum
        const pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const isValid = pattern.test(gstin.toUpperCase());
        if (!isValid) {
            return { gstin, valid: false, errorMessage: "Invalid GSTIN format. Expected 15-character alphanumeric string." };
        }
        const stateCode = gstin.slice(0, 2);
        const state = STATE_CODES[stateCode] ?? "Unknown State";
        const vendors = [
            { name: "UltraTech Cement Ltd", trade: "UltraTech Cement", type: "Regular", status: "Active" },
            { name: "Tata Steel Ltd", trade: "Tata Steel", type: "Regular", status: "Active" },
            { name: "Schneider Electric India Pvt Ltd", trade: "Schneider Electric", type: "Regular", status: "Active" },
            { name: "Polycab Wires Ltd", trade: "Polycab", type: "Regular", status: "Active" },
            { name: "Larsen & Toubro Ltd", trade: "L&T Construction", type: "Regular", status: "Active" }
        ];
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        return {
            gstin: gstin.toUpperCase(),
            valid: true,
            legalName: vendor.name,
            tradeName: vendor.trade,
            registrationDate: "2017-07-01",
            taxPayerType: vendor.type,
            gstStatus: vendor.status,
            stateCode,
            state
        };
    }
    generateEInvoice(tenantId, invoiceData) {
        const timestamp = Date.now();
        const irn = `${Buffer.from(JSON.stringify({ tenantId, timestamp })).toString("base64").slice(0, 64)}`;
        const ackNo = `11${Math.floor(10000000000 + Math.random() * 90000000000)}`;
        const ewbNo = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        return {
            irn,
            ackNo,
            ackDate: new Date().toISOString(),
            signedInvoice: `eyJhbGciOiJSUzI1NiJ9.${Buffer.from(JSON.stringify({ irn, ackNo, tenantId, invoiceData })).toString("base64")}.mock_signature`,
            qrCodeData: `${irn}|${ackNo}|${new Date().toISOString()}`,
            status: "generated",
            ewbNo
        };
    }
    generateEWayBill(tenantId, billData) {
        const ewbNo = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        const validDays = (billData.distance ?? 100) > 200 ? 3 : 1;
        const validUpto = new Date(Date.now() + validDays * 86400000).toISOString();
        return {
            ewbNo,
            ewbDate: new Date().toISOString(),
            validUpto,
            alert: validDays === 1 ? "Valid for 1 day only. Extend if transit exceeds 200 km." : undefined,
            status: "active"
        };
    }
    getGstrStatus(tenantId) {
        const now = new Date();
        const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const itcAvailable = 1840000;
        const liability = 21000000;
        return {
            tenantId,
            period,
            gstr1: { filed: true, filingDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-11`, liability: 2800000 },
            gstr2b: { available: true, matchPercent: 97.2, mismatchCount: 3 },
            gstr3b: { filed: false, dueDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-20`, liability },
            tdsReturn: { filed: false, dueDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-31`, amount: 1820000 },
            itcAvailable,
            netLiability: liability - itcAvailable
        };
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)()
], ComplianceService);
