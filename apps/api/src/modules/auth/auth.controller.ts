import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() body: { tenantId: string; email: string; password: string }) {
    console.log('[AUTH_DEBUG] Login attempt received:', { 
      tenantId: body.tenantId, 
      email: body.email,
      passwordLength: body.password?.length 
    });
    return this.auth.login(body);
  }

  @Get("me")
  me(@Headers("authorization") authorization?: string) {
    const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
    return this.auth.verifyToken(token);
  }
}
