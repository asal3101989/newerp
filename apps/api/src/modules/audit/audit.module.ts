import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AuditController } from "./audit.controller";
import { AuditService } from "./audit.service";
import { AuditScheduler } from "./audit.scheduler";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AuditController],
  providers: [AuditService, AuditScheduler],
  exports: [AuditService]
})
export class AuditModule {}
