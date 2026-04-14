import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LedgerEntry } from "../ledger-entry/ledger-entry.entity";
import { LedgerOperation } from "../ledger-operation/ledger-operation.entity";
import { Lot } from "../lot/lot.entity";
import { PartCategory } from "../part-category/part-category.entity";
import { PartManufacturer } from "../part-manufacturer/part-manufacturer.entity";
import { PartSupplier } from "../part-supplier/part-supplier.entity";
import { VehicleModel } from "../vehicle-model/vehicle-model.entity";
import { PartController } from "./part.controller";
import { Part } from "./part.entity";
import { AddPartsSupplyUseCase } from "./usecases/add-parts-supply.usecase";
import { CreatePartUseCase } from "./usecases/create-part.usecase";
import { ListPartsUseCase } from "./usecases/list-parts.usecase";
import { RemovePartsUseCase } from "./usecases/remove-parts.usecase";
import { ReturnPartsUseCase } from "./usecases/return-parts.usecase";

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
	controllers: [PartController],
	providers: [
		ListPartsUseCase,
		CreatePartUseCase,
		AddPartsSupplyUseCase,
		RemovePartsUseCase,
		ReturnPartsUseCase,
	],
})
export class PartModule {}
