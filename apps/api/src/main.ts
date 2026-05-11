import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("api/v1");

  const port = Number(process.env.API_PORT ?? 7001);
  await app.listen(port, "0.0.0.0");
  console.log(`NirmaanCloud API running at http://127.0.0.1:${port}/api/v1`);
}

bootstrap();
