import { Module } from "@nestjs/common";
import { ProcurementController } from "./procurement.controller";
import { ProcurementService } from "./procurement.service";
import { VendorsService } from "./vendors.service";
import { MaterialRequisitionsService } from "./material-requisitions.service";
import { RfqService } from "./rfq.service";
import { GrnService } from "./grn.service";

import { InventoryModule } from "../inventory/inventory.module";

@Module({
  imports: [InventoryModule],
  controllers: [ProcurementController],
  providers: [
    ProcurementService,
    VendorsService,
    MaterialRequisitionsService,
    RfqService,
    GrnService
  ]
})
export class ProcurementModule {}
