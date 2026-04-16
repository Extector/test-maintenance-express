import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";

import { AddPartsSupplyUseCase } from "./usecases/add-parts-supply.usecase";
import { CreatePartUseCase } from "./usecases/create-part.usecase";
import { ListPartsUseCase } from "./usecases/list-parts.usecase";
import { RemovePartsUseCase } from "./usecases/remove-parts.usecase";
import { ReturnPartsUseCase } from "./usecases/return-parts.usecase";

@Controller("parts")
export class PartController {
	constructor(
		private readonly listPartsUseCase: ListPartsUseCase,
		private readonly createPartUseCase: CreatePartUseCase,
		private readonly addPartsSupplyUseCase: AddPartsSupplyUseCase,
		private readonly removePartsUseCase: RemovePartsUseCase,
		private readonly returnPartsUseCase: ReturnPartsUseCase,
	) {}

	@Get()
	async listParts() {
		return this.listPartsUseCase.execute();
	}

	@Post()
	@HttpCode(201)
	async createPart(
		@Body()
		body: {
			name: string;
			description: string | undefined;
			partCategoryId: number;
			vehicleModelId: number | undefined;
		},
	) {
		return this.createPartUseCase.execute({
			name: body.name,
			description: body.description,
			partCategoryId: body.partCategoryId,
			vehicleModelId: body.vehicleModelId,
		});
	}

	@Post("add")
	@HttpCode(200)
	async addPartsSupply(
		@Body()
		body: {
			partsSupply: {
				partId: number;
				manufacturerId: number;
				supplierId: number;
				quantity: number;
				unitPrice: number;
			}[];
		},
	) {
		await this.addPartsSupplyUseCase.execute({ partsSupply: body.partsSupply });
	}

	@Post("remove")
	@HttpCode(200)
	async removeParts(
		@Body()
		body: {
			description: string;
			partsRemoval: { partId: number; quantity: number }[];
		},
	) {
		return this.removePartsUseCase.execute({
			description: body.description,
			partsRemoval: body.partsRemoval,
		});
	}

	@Post("return")
	@HttpCode(200)
	async returnParts(
		@Body()
		body: {
			partsReturn: {
				partId: number;
				referenceOperationId: number;
				reason: string;
				items: { lotId: number; quantity: number }[];
			}[];
		},
	) {
		return this.returnPartsUseCase.execute({ partsReturn: body.partsReturn });
	}
}
