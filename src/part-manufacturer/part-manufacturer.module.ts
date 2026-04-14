import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartManufacturerController } from "./part-manufacturer.controller";
import { PartManufacturer } from "./part-manufacturer.entity";
import { CreatePartManufacturerUseCase } from "./usecases/create-part-manufacturer.usecase";
import { ListPartManufacturersUseCase } from "./usecases/list-part-manufacturers.usecase";

@Module({
	imports: [TypeOrmModule.forFeature([PartManufacturer])],
	controllers: [PartManufacturerController],
	providers: [ListPartManufacturersUseCase, CreatePartManufacturerUseCase],
	exports: [TypeOrmModule],
})
export class PartManufacturerModule {}
