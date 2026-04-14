import "reflect-metadata";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);
	app.setGlobalPrefix("api/v1");
	const port = config.get<number>("PORT") ?? 3000;
	await app.listen(port);
}

bootstrap();
