import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VehicleModel } from "../vehicle-model.entity";

export interface CreateVehicleModelInput {
	name: string;
}

@Injectable()
export class CreateVehicleModelUseCase {
	constructor(
		@InjectRepository(VehicleModel)
		private readonly vehicleModelRepository: Repository<VehicleModel>,
	) {}

	async execute(input: CreateVehicleModelInput): Promise<VehicleModel> {
		const vehicleModel = new VehicleModel();
		vehicleModel.name = input.name;
		vehicleModel.description = "";
		return this.vehicleModelRepository.save(vehicleModel);
	}
}
