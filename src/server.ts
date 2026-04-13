import express from "express";

import {
	partCategoryRouter,
	partSuppliersRouter,
	partsRouter,
	vehicleModelsRouter,
} from "./routes";
import { manufacturersRouter } from "./routes/part-manufacturers.router";

export function createServer() {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use("/api/v1/parts", partsRouter);
	app.use("/api/v1/vehicle-models", vehicleModelsRouter);
	app.use("/api/v1/manufacturers", manufacturersRouter);
	app.use("/api/v1/part-categories", partCategoryRouter);
	app.use("/api/v1/part-suppliers", partSuppliersRouter);

	return app;
}
