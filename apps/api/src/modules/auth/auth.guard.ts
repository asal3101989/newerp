import "reflect-metadata";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { IS_PUBLIC_ROUTE } from "./public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext) {
    // Try both methods to read the metadata
    const handler = context.getHandler();
    const classRef = context.getClass();

    // Method 1: Using Reflector
    let isPublic = this.reflector?.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [handler, classRef]);

    // Method 2: Direct metadata read as fallback
    if (!isPublic) {
      isPublic = Reflect.getMetadata(IS_PUBLIC_ROUTE, classRef) || Reflect.getMetadata(IS_PUBLIC_ROUTE, handler);
    }

    const req = context.switchToHttp().getRequest();
    console.log(`[AUTH_GUARD_DEBUG] Path: ${req.url}, isPublic: ${isPublic}`);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; user?: unknown }>();
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    request.user = this.auth.verifyToken(token);
    return true;
  }
}
