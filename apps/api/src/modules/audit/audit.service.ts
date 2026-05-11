import { Injectable, Inject, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { randomUUID } from "crypto";

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return (this.prisma as any).auditEvent.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 200
    });
  }

  async log(tenantId: string, entity: string, action: string, entityId: string, userId?: string, metadata?: unknown) {
    return (this.prisma as any).auditEvent.create({
      data: {
        id: randomUUID(),
        tenantId,
        entity,
        action,
        entityId,
        userId,
        after: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
      }
    });
  }

  async cleanup(retentionDays = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);

    const result = await (this.prisma as any).auditEvent.deleteMany({
      where: { createdAt: { lt: cutoff } }
    });

    this.logger.log(`Audit cleanup: deleted ${result.count} events older than ${retentionDays} days`);
    return result;
  }
}
