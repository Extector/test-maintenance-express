import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { CreatePartCategoryUseCase } from "./usecases/create-part-category.usecase";
import { ListPartCategoriesUseCase } from "./usecases/list-part-categories.usecase";

@Controller("part-categories")
export class PartCategoryController {
	constructor(
		private readonly listPartCategoriesUseCase: ListPartCategoriesUseCase,
		private readonly createPartCategoryUseCase: CreatePartCategoryUseCase,
	) {}

	@Get()
	async list() {
		return this.listPartCategoriesUseCase.execute();
	}

	@Post()
	@HttpCode(201)
	async create(@Body() body: { name: string }) {
		return this.createPartCategoryUseCase.execute({ name: body.name });
	}
}
