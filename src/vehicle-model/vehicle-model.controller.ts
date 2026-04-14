import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { CreateVehicleModelUseCase } from "./usecases/create-vehicle-model.usecase";
import { ListVehicleModelsUseCase } from "./usecases/list-vehicle-models.usecase";

@Controller("vehicle-models")
export class VehicleModelController {
	constructor(
		private readonly listVehicleModelsUseCase: ListVehicleModelsUseCase,
		private readonly createVehicleModelUseCase: CreateVehicleModelUseCase,
	) {}

	@Get()
	async list() {
		return this.listVehicleModelsUseCase.execute();
	}

	@Post()
	@HttpCode(201)
	async create(@Body() body: { name: string }) {
		return this.createVehicleModelUseCase.execute({ name: body.name });
	}
}
