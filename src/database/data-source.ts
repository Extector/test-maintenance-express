import "reflect-metadata";
import path from "node:path";
import { DataSource } from "typeorm";
import { LedgerEntry } from "../ledger-entry/ledger-entry.entity";
import { LedgerOperation } from "../ledger-operation/ledger-operation.entity";
import { Lot } from "../lot/lot.entity";
import { Part } from "../part/part.entity";
import { PartCategory } from "../part-category/part-category.entity";
import { PartManufacturer } from "../part-manufacturer/part-manufacturer.entity";
import { PartSupplier } from "../part-supplier/part-supplier.entity";
import { VehicleModel } from "../vehicle-model/vehicle-model.entity";

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
