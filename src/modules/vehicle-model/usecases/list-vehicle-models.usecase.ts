import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VehicleModel } from "../vehicle-model.entity";

@Injectable()
export class ListVehicleModelsUseCase {
	constructor(
		@InjectRepository(VehicleModel)
		private readonly vehicleModelRepository: Repository<VehicleModel>,
	) {}

	async execute(): Promise<VehicleModel[]> {
		return this.vehicleModelRepository.find();
	}
}
