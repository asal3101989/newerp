import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";

// SharedModule re-exports PrismaModule for backwards compatibility
// Modules that import SharedModule will have access to PrismaService
@Module({
  imports: [PrismaModule],
  exports: [PrismaModule]
})
export class SharedModule {}
