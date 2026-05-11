import { Module } from "@nestjs/common";
import { ModuleActionsController } from "./module-actions.controller";
import { ModuleActionsService } from "./module-actions.service";

@Module({
  controllers: [ModuleActionsController],
  providers: [ModuleActionsService]
})
export class ModuleActionsModule {}
