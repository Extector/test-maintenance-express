import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateVehicleModelUseCase } from "./usecases/create-vehicle-model.usecase";
import { ListVehicleModelsUseCase } from "./usecases/list-vehicle-models.usecase";
import { VehicleModelController } from "./vehicle-model.controller";
import { VehicleModel } from "./vehicle-model.entity";

@Module({
	imports: [TypeOrmModule.forFeature([VehicleModel])],
	controllers: [VehicleModelController],
	providers: [ListVehicleModelsUseCase, CreateVehicleModelUseCase],
	exports: [TypeOrmModule],
})
export class VehicleModelModule {}
