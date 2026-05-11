import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { createHmac, createHash } from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service";

type LoginInput = {
  tenantId: string;
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(input: LoginInput) {
    console.log('[AUTH_DEBUG] AuthService.login called for:', { tenantId: input.tenantId, email: input.email });
    const user = await this.prisma.user.findFirst({
      where: {
        tenantId: input.tenantId,
        email: input.email,
      },
      include: { 
        tenant: true,
        role: {
          include: {
            permissions: {
              include: { permission: true }
            }
          }
        }
      }
    });

    console.log('[AUTH_DEBUG] Database user lookup:', user ? { id: user.id, email: user.email, tenantId: user.tenantId } : 'USER NOT FOUND');

    const inputHash = this.hash(input.password);
    console.log('[AUTH_DEBUG] Password check:', {
      inputHash,
      storedHash: user?.passwordHash,
      match: user?.passwordHash === inputHash
    });

    if (!user || user.passwordHash !== inputHash) {
      throw new NotFoundException("Invalid tenant, email, or password");
    }

    const permissions = user.role?.permissions?.map(rp => rp.permission.code) || [];

    const token = this.sign({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.roleId ?? "User",
      permissions: permissions
    });

    return {
      accessToken: token,
      tokenType: "Bearer",
      tenant: user.tenant,
      user: {
        id: user.id,
        name: user.name,
        role: user.roleId ?? "User",
        department: user.department || "Operations",
        permissions: permissions,
        mfaRequired: false
      }
    };
  }

  private hash(value: string) {
    return createHash("sha256").update(value).digest("hex");
  }

  private sign(payload: Record<string, unknown>) {
    const header = this.base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = this.base64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
    const secret = process.env.JWT_SECRET ?? "dev-secret-change-me";
    const signature = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
    return `${header}.${body}.${signature}`;
  }

  verifyToken(token: string) {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) {
      throw new UnauthorizedException("Invalid token");
    }

    const secret = process.env.JWT_SECRET ?? "dev-secret-change-me";
    const expected = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
    if (expected !== signature) {
      throw new UnauthorizedException("Invalid token signature");
    }

    try {
      return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    } catch {
      throw new UnauthorizedException("Invalid token payload");
    }
  }

  private base64url(value: string) {
    return Buffer.from(value).toString("base64url");
  }
}
