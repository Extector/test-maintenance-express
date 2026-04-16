import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartCategory } from "../part-category.entity";

@Injectable()
export class ListPartCategoriesUseCase {
	constructor(
		@InjectRepository(PartCategory)
		private readonly partCategoryRepository: Repository<PartCategory>,
	) {}

	async execute(): Promise<PartCategory[]> {
		return this.partCategoryRepository.find();
	}
}
