import "reflect-metadata";
import AppDataSource from "./database/data-source";

import { createServer } from "./server";

async function bootstrap() {
	await AppDataSource.initialize();
	console.log("Database initialized");

	const app = createServer();
	app.listen(3000, () => {
		console.log("Server is running on port 3000");
	});
}

bootstrap();
