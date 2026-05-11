import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/public.decorator";
import { HealthService } from "./health.service";

@Public()
@Controller("health")
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  async getStatus() {
    return this.health.getStatus();
  }
}
