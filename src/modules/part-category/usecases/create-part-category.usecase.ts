import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartCategory } from "../part-category.entity";

export interface CreatePartCategoryInput {
	name: string;
}

@Injectable()
export class CreatePartCategoryUseCase {
	constructor(
		@InjectRepository(PartCategory)
		private readonly partCategoryRepository: Repository<PartCategory>,
	) {}

	async execute(input: CreatePartCategoryInput): Promise<PartCategory> {
		const partCategory = new PartCategory();
		partCategory.name = input.name;
		return this.partCategoryRepository.save(partCategory);
	}
}
