import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppConfigModule } from "./config/app-config.module";
import { LedgerEntry } from "./ledger-entry/ledger-entry.entity";
import { LedgerEntryModule } from "./ledger-entry/ledger-entry.module";
import { LedgerOperation } from "./ledger-operation/ledger-operation.entity";
import { LedgerOperationModule } from "./ledger-operation/ledger-operation.module";
import { Lot } from "./lot/lot.entity";
import { LotModule } from "./lot/lot.module";
import { Part } from "./part/part.entity";
import { PartModule } from "./part/part.module";
import { PartCategory } from "./part-category/part-category.entity";
import { PartCategoryModule } from "./part-category/part-category.module";
import { PartManufacturer } from "./part-manufacturer/part-manufacturer.entity";
import { PartManufacturerModule } from "./part-manufacturer/part-manufacturer.module";
import { PartSupplier } from "./part-supplier/part-supplier.entity";
import { PartSupplierModule } from "./part-supplier/part-supplier.module";
import { VehicleModel } from "./vehicle-model/vehicle-model.entity";
import { VehicleModelModule } from "./vehicle-model/vehicle-model.module";

@Module({
	imports: [
		AppConfigModule,
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService) => ({
				type: "postgres",
				host: config.get<string>("DATABASE_HOST"),
				port: config.get<number>("DATABASE_PORT"),
				username: config.get<string>("DATABASE_USERNAME"),
				password: config.get<string>("DATABASE_PASSWORD"),
				database: config.get<string>("DATABASE_NAME"),
				schema: config.get<string>("DATABASE_SCHEMA"),
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
				synchronize: false,
			}),
			inject: [ConfigService],
		}),
		VehicleModelModule,
		PartManufacturerModule,
		PartCategoryModule,
		PartSupplierModule,
		LotModule,
		LedgerEntryModule,
		LedgerOperationModule,
		PartModule,
	],
})
export class AppModule {}
