import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartSupplier } from "../part-supplier.entity";

@Injectable()
export class ListPartSuppliersUseCase {
	constructor(
		@InjectRepository(PartSupplier)
		private readonly partSupplierRepository: Repository<PartSupplier>,
	) {}

	async execute(): Promise<PartSupplier[]> {
		return this.partSupplierRepository.find();
	}
}
