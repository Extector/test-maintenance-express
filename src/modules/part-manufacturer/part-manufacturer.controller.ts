import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreatePartManufacturerUseCase } from "./usecases/create-part-manufacturer.usecase";
import { ListPartManufacturersUseCase } from "./usecases/list-part-manufacturers.usecase";

@Controller("manufacturers")
export class PartManufacturerController {
	constructor(
		private readonly listPartManufacturersUseCase: ListPartManufacturersUseCase,
		private readonly createPartManufacturerUseCase: CreatePartManufacturerUseCase,
	) {}

	@Get()
	async list() {
		return this.listPartManufacturersUseCase.execute();
	}

	@Post()
	async create(@Body() body: { name: string }) {
		return this.createPartManufacturerUseCase.execute({ name: body.name });
	}
}
