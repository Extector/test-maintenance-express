import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartManufacturer } from "../part-manufacturer.entity";

@Injectable()
export class ListPartManufacturersUseCase {
	constructor(
		@InjectRepository(PartManufacturer)
		private readonly partManufacturerRepository: Repository<PartManufacturer>,
	) {}

	async execute(): Promise<PartManufacturer[]> {
		return this.partManufacturerRepository.find();
	}
}
