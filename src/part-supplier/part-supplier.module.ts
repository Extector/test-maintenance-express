import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartSupplierController } from "./part-supplier.controller";
import { PartSupplier } from "./part-supplier.entity";
import { CreatePartSupplierUseCase } from "./usecases/create-part-supplier.usecase";
import { ListPartSuppliersUseCase } from "./usecases/list-part-suppliers.usecase";

@Module({
	imports: [TypeOrmModule.forFeature([PartSupplier])],
	controllers: [PartSupplierController],
	providers: [ListPartSuppliersUseCase, CreatePartSupplierUseCase],
	exports: [TypeOrmModule],
})
export class PartSupplierModule {}
