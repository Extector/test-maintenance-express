import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, In } from "typeorm";
import { LedgerEntry } from "../../ledger-entry/ledger-entry.entity";
import { LedgerOperation } from "../../ledger-operation/ledger-operation.entity";
import { Lot } from "../../lot/lot.entity";
import { PartManufacturer } from "../../part-manufacturer/part-manufacturer.entity";
import { PartSupplier } from "../../part-supplier/part-supplier.entity";
import { Part } from "../part.entity";

export interface PartsSupplyLine {
	partId: number;
	manufacturerId: number;
	supplierId: number;
	quantity: number;
	unitPrice: number;
}

export interface AddPartsSupplyInput {
	partsSupply: PartsSupplyLine[];
}

@Injectable()
export class AddPartsSupplyUseCase {
	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async execute(input: AddPartsSupplyInput): Promise<void> {
		const { partsSupply } = input;

		const { partIds, manufacturerIds, supplierIds } = partsSupply.reduce(
			(acc, { partId, manufacturerId, supplierId }) => {
				acc.partIds.push(partId);
				acc.manufacturerIds.push(manufacturerId);
				acc.supplierIds.push(supplierId);
				return acc;
			},
			{
				partIds: [] as number[],
				manufacturerIds: [] as number[],
				supplierIds: [] as number[],
			},
		);

		const partIdsSet = new Set(partIds);
		const manufacturersSet = new Set(manufacturerIds);
		const suppliersSet = new Set(supplierIds);

		const partRepository = this.dataSource.getRepository(Part);
		const partManufacturerRepository =
			this.dataSource.getRepository(PartManufacturer);
		const partSupplierRepository = this.dataSource.getRepository(PartSupplier);

		const [parts, manufacturers, suppliers] = await Promise.all([
			partRepository.findBy({ id: In(partIds) }),
			partManufacturerRepository.findBy({ id: In(manufacturerIds) }),
			partSupplierRepository.findBy({ id: In(supplierIds) }),
		]);

		const foundPartIds = new Set(parts.map((p) => p.id));
		const foundManufacturerIds = new Set(manufacturers.map((m) => m.id));
		const foundSupplierIds = new Set(suppliers.map((s) => s.id));

		const notFoundPartIds = [...partIdsSet].filter(
			(id) => !foundPartIds.has(id),
		);
		const notFoundManufacturerIds = [...manufacturersSet].filter(
			(id) => !foundManufacturerIds.has(id),
		);
		const notFoundSupplierIds = [...suppliersSet].filter(
			(id) => !foundSupplierIds.has(id),
		);

		if (
			notFoundPartIds.length > 0 ||
			notFoundManufacturerIds.length > 0 ||
			notFoundSupplierIds.length > 0
		) {
			throw new NotFoundException({
				message: "Entities Not Found",
				partIds: notFoundPartIds,
				manufacturerIds: notFoundManufacturerIds,
				supplierIds: notFoundSupplierIds,
			});
		}

		const lots = partsSupply.map((supply) => {
			const lot = new Lot();
			const partManufacturer = manufacturers.find(
				(manufacturer: PartManufacturer) =>
					manufacturer.id === supply.manufacturerId,
			);
			const partSupplier = suppliers.find(
				(supplier: PartSupplier) => supplier.id === supply.supplierId,
			);

			if (!partManufacturer) {
				throw new Error("Error Manufacturer Not Found");
			}
			if (!partSupplier) {
				throw new Error("Error Supplier Not Found");
			}

			lot.partId = supply.partId;
			lot.partManufacturer = partManufacturer;
			lot.partSupplier = partSupplier;
			lot.initialQuantity = supply.quantity;
			lot.remainingQuantity = supply.quantity;
			lot.unitPrice = supply.unitPrice;
			lot.createdAt = new Date();
			return lot;
		});

		const operation = new LedgerOperation();
		operation.createdAt = new Date();
		operation.type = "entry";
		operation.description = "";

		const ledgerEntries = lots.map((lot) => {
			const ledgerEntry = new LedgerEntry();
			ledgerEntry.lot = lot;
			ledgerEntry.operation = operation;
			ledgerEntry.type = "credit";
			ledgerEntry.quantity = lot.initialQuantity;
			ledgerEntry.createdAt = new Date();
			return ledgerEntry;
		});

		try {
			await this.dataSource.transaction(async (manager) => {
				await manager.save(lots);
				await manager.save(operation);
				await manager.save(ledgerEntries);
			});
		} catch (e) {
			throw new BadRequestException({
				message: "An error occurred in DB Transaction",
				details: e,
			});
		}
	}
}
