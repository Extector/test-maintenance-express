import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Part } from "../part.entity";

@Injectable()
export class ListPartsUseCase {
	constructor(
		@InjectRepository(Part)
		private readonly partRepository: Repository<Part>,
	) {}

	async execute(): Promise<Part[]> {
		return this.partRepository.find();
	}
}
