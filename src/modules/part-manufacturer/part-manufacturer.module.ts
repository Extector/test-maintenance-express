import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LedgerEntry } from "../ledger-entry/ledger-entry.entity";
import { LedgerOperation } from "../ledger-operation/ledger-operation.entity";
import { Lot } from "../lot/lot.entity";
import { PartCategory } from "../part-category/part-category.entity";
import { PartSupplier } from "../part-supplier/part-supplier.entity";
import { Part } from "../part/part.entity";
import { VehicleModel } from "../vehicle-model/vehicle-model.entity";
import { PartManufacturerController } from "./part-manufacturer.controller";
import { PartManufacturer } from "./part-manufacturer.entity";
import { CreatePartManufacturerUseCase } from "./usecases/create-part-manufacturer.usecase";
import { ListPartManufacturersUseCase } from "./usecases/list-part-manufacturers.usecase";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Part,
			Lot,
			LedgerEntry,
			LedgerOperation,
			PartCategory,
			VehicleModel,
			PartManufacturer,
			PartSupplier,
		]),
	],
	controllers: [PartManufacturerController],
	providers: [ListPartManufacturersUseCase, CreatePartManufacturerUseCase],
	exports: [TypeOrmModule],
})
export class PartManufacturerModule {}
