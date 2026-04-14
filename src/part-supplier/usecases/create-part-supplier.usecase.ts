import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartSupplier } from "../part-supplier.entity";

export interface CreatePartSupplierInput {
	name: string;
}

@Injectable()
export class CreatePartSupplierUseCase {
	constructor(
		@InjectRepository(PartSupplier)
		private readonly partSupplierRepository: Repository<PartSupplier>,
	) {}

	async execute(input: CreatePartSupplierInput): Promise<void> {
		const supplier = new PartSupplier();
		supplier.name = input.name;
		await this.partSupplierRepository.save(supplier);
	}
}
