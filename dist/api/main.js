"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.setGlobalPrefix("api/v1");
    const port = Number(process.env.API_PORT ?? 7001);
    await app.listen(port, "0.0.0.0");
    console.log(`NirmaanCloud API running at http://127.0.0.1:${port}/api/v1`);
}
bootstrap();
