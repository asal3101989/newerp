import { Injectable } from "@nestjs/common";

@Injectable()
export class ModuleActionsService {
  constructor() {}

  record(tenantId: string, input: { module: string; submenu: string; action: string; message: string }) {
    return {
      ok: true,
      event: {},
      audit: {}
    };
  }
}
