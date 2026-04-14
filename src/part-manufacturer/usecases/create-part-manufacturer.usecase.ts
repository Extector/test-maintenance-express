import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartManufacturer } from "../part-manufacturer.entity";

export interface CreatePartManufacturerInput {
	name: string;
}

@Injectable()
export class CreatePartManufacturerUseCase {
	constructor(
		@InjectRepository(PartManufacturer)
		private readonly partManufacturerRepository: Repository<PartManufacturer>,
	) {}

	async execute(input: CreatePartManufacturerInput): Promise<PartManufacturer> {
		const manufacturer = new PartManufacturer();
		manufacturer.name = input.name;
		return this.partManufacturerRepository.save(manufacturer);
	}
}
