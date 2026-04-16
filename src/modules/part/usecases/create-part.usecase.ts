import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartCategory } from "../../part-category/part-category.entity";
import { VehicleModel } from "../../vehicle-model/vehicle-model.entity";
import { Part } from "../part.entity";

export interface CreatePartInput {
	name: string;
	description: string | undefined;
	partCategoryId: number;
	vehicleModelId: number | undefined;
}

@Injectable()
export class CreatePartUseCase {
	constructor(
		@InjectRepository(Part)
		private readonly partRepository: Repository<Part>,
		@InjectRepository(PartCategory)
		private readonly partCategoryRepository: Repository<PartCategory>,
		@InjectRepository(VehicleModel)
		private readonly vehicleModelRepository: Repository<VehicleModel>,
	) {}

	async execute(input: CreatePartInput): Promise<Part> {
		const part = new Part();
		part.name = input.name;
		part.description = input.description;

		const partCategory = await this.partCategoryRepository.findOne({
			where: { id: input.partCategoryId },
		});

		if (!partCategory) {
			throw new NotFoundException({ message: "Part category not found" });
		}

		const vehicleModel =
			input.vehicleModelId === undefined || input.vehicleModelId === null
				? null
				: await this.vehicleModelRepository.findOne({
						where: { id: input.vehicleModelId },
					});

		part.partCategory = partCategory;
		part.vehicleModel = vehicleModel ?? null;

		return this.partRepository.save(part);
	}
}
