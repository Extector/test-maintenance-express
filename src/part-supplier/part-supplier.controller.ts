import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { CreatePartSupplierUseCase } from "./usecases/create-part-supplier.usecase";
import { ListPartSuppliersUseCase } from "./usecases/list-part-suppliers.usecase";

@Controller("part-suppliers")
export class PartSupplierController {
	constructor(
		private readonly listPartSuppliersUseCase: ListPartSuppliersUseCase,
		private readonly createPartSupplierUseCase: CreatePartSupplierUseCase,
	) {}

	@Get()
	async list() {
		return this.listPartSuppliersUseCase.execute();
	}

	@Post()
	@HttpCode(200)
	async create(@Body() body: { name: string }) {
		await this.createPartSupplierUseCase.execute({ name: body.name });
	}
}
