import "reflect-metadata";
import path from "node:path";
import { DataSource } from "typeorm";
import * as entities from "../entities";

const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "postgres",
	password: "postgres",
	database: "stock-poc",
	schema: "public",
	entities: [
		entities.Part,
		entities.Lot,
		entities.PartManufacturer,
		entities.PartSupplier,
		entities.PartCategory,
		entities.VehicleModel,
		entities.LedgerEntry,
		entities.LedgerOperation,
	],
	migrations: [path.join(__dirname, "migrations", "*.ts")],
});

export default AppDataSource;
