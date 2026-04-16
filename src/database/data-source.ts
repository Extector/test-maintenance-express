import path from "node:path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { LedgerEntry } from "../modules/ledger-entry/ledger-entry.entity";
import { LedgerOperation } from "../modules/ledger-operation/ledger-operation.entity";
import { Lot } from "../modules/lot/lot.entity";
import { PartCategory } from "../modules/part-category/part-category.entity";
import { PartManufacturer } from "../modules/part-manufacturer/part-manufacturer.entity";
import { PartSupplier } from "../modules/part-supplier/part-supplier.entity";
import { Part } from "../modules/part/part.entity";
import { VehicleModel } from "../modules/vehicle-model/vehicle-model.entity";

const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DATABASE_HOST ?? "localhost",
	port: Number(process.env.DATABASE_PORT ?? 5432),
	username: process.env.DATABASE_USERNAME ?? "postgres",
	password: process.env.DATABASE_PASSWORD ?? "postgres",
	database: process.env.DATABASE_NAME ?? "stock-poc",
	schema: process.env.DATABASE_SCHEMA ?? "public",
	entities: [
		Part,
		Lot,
		PartManufacturer,
		PartSupplier,
		PartCategory,
		VehicleModel,
		LedgerEntry,
		LedgerOperation,
	],
	migrations: [path.join(__dirname, "migrations", "*.ts")],
});

export default AppDataSource;
