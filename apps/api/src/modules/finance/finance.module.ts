import { Module } from "@nestjs/common";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";

import { RABillsService } from "./ra-bills.service";

@Module({
  controllers: [FinanceController],
  providers: [FinanceService, RABillsService]
})
export class FinanceModule {}
