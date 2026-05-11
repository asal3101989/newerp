import { Controller, Get, Param } from "@nestjs/common";
import { DocumentsService } from "./documents.service";

@Controller("tenants/:tenantId/documents")
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  findByTenant(@Param("tenantId") tenantId: string) {
    return this.documents.findByTenant(tenantId);
  }

  @Get("ocr-queue")
  getOcrQueue(@Param("tenantId") tenantId: string) {
    return this.documents.getOcrQueue(tenantId);
  }
}
