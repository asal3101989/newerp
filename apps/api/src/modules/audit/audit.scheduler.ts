import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuditService } from "./audit.service";

@Injectable()
export class AuditScheduler {
  private readonly logger = new Logger(AuditScheduler.name);

  constructor(private readonly auditService: AuditService) {}

  // Runs every day at 2:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyCleanup() {
    this.logger.log("Running daily audit log cleanup...");
    const retentionDays = Number(process.env.AUDIT_RETENTION_DAYS ?? 90);
    await this.auditService.cleanup(retentionDays);
  }
}
