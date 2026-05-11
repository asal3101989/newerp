import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { RecordsController } from "./records.controller";
import { RecordsService } from "./records.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}
