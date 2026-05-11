import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Public } from "../auth/public.decorator";
import { AiService, ChatMessage } from "./ai.service";

@Controller("tenants/:tenantId/ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Public()
  @Get("insights")
  getInsights(@Param("tenantId") tenantId: string) {
    return this.aiService.getInsights(tenantId);
  }

  @Public()
  @Post("ocr")
  processOcr(@Param("tenantId") tenantId: string, @Body() body: { fileName?: string }) {
    return this.aiService.processOcr(tenantId, body.fileName);
  }

  @Public()
  @Post("forecast")
  generateForecast(
    @Param("tenantId") tenantId: string,
    @Body() body: { domain?: "cashflow" | "delay" | "procurement" | "labour" }
  ) {
    return this.aiService.generateForecast(tenantId, body.domain ?? "cashflow");
  }

  @Public()
  @Post("chat")
  chat(
    @Param("tenantId") tenantId: string,
    @Body() body: { messages: ChatMessage[]; context?: string }
  ) {
    return this.aiService.chat(tenantId, body.messages ?? [], body.context);
  }
}
