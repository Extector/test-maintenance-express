import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, In, MoreThan } from "typeorm";
import { LedgerEntry } from "../../ledger-entry/ledger-entry.entity";
import { LedgerOperation } from "../../ledger-operation/ledger-operation.entity";
import { Lot } from "../../lot/lot.entity";
import { Part } from "../part.entity";

export interface PartsRemovalLine {
	partId: number;
	quantity: number;
}

export interface RemovePartsInput {
	description: string;
	partsRemoval: PartsRemovalLine[];
}

@Injectable()
export class RemovePartsUseCase {
	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async execute(input: RemovePartsInput): Promise<{ message: string }> {
		const { partsRemoval, description } = input;

		if (!Array.isArray(partsRemoval) || partsRemoval.length === 0) {
			throw new BadRequestException({
				message: "partsRemoval must be a non-empty array",
			});
		}

		const aggregatedByPartId = new Map<number, number>();
		for (const { partId, quantity } of partsRemoval) {
			if (!Number.isInteger(quantity) || quantity <= 0) {
				throw new BadRequestException({
					message: "Each quantity must be a positive integer",
					partId,
				});
			}

			aggregatedByPartId.set(
				partId,
				(aggregatedByPartId.get(partId) ?? 0) + quantity,
			);
		}

		const partIds = [...aggregatedByPartId.keys()];
		const partIdsSet = new Set(partIds);

		try {
			await this.dataSource.transaction(async (manager) => {
				const parts = await manager.find(Part, { where: { id: In(partIds) } });
				if (parts.length !== partIds.length) {
					const foundPartIds = new Set(parts.map((p) => p.id));
					const notFoundPartIds = [...partIdsSet].filter(
						(id) => !foundPartIds.has(id),
					);
					throw new NotFoundException({
						message: "Entities Not Found",
						partIds: notFoundPartIds,
					});
				}

				const lotRepo = manager.getRepository(Lot);
				const allLots = await lotRepo.find({
					where: { partId: In(partIds), remainingQuantity: MoreThan(0) },
					order: { createdAt: "ASC" },
					lock: { mode: "pessimistic_write" },
				});

				const lotsByPartId = new Map<number, Lot[]>();
				for (const lot of allLots) {
					const list = lotsByPartId.get(lot.partId) ?? [];
					list.push(lot);
					lotsByPartId.set(lot.partId, list);
				}

				const insufficient: {
					partId: number;
					requested: number;
					available: number;
				}[] = [];
				for (const [partId, requested] of aggregatedByPartId) {
					const lotsForPart = lotsByPartId.get(partId) ?? [];
					const available = lotsForPart.reduce(
						(sum, lot) => sum + lot.remainingQuantity,
						0,
					);
					if (available < requested) {
						insufficient.push({ partId, requested, available });
					}
				}

				if (insufficient.length > 0) {
					throw new BadRequestException({
						message: "Insufficient stock in lots for one or more parts",
						details: insufficient,
					});
				}

				const operation = new LedgerOperation();
				operation.createdAt = new Date();
				operation.type = "exit";
				operation.description = description;

				const ledgerEntries: LedgerEntry[] = [];
				const now = new Date();

				for (const [partId, quantityToRemove] of aggregatedByPartId) {
					const lotsForPart = lotsByPartId.get(partId) ?? [];
					let remaining = quantityToRemove;
					for (const lot of lotsForPart) {
						if (remaining <= 0) {
							break;
						}
						if (lot.remainingQuantity <= 0) {
							continue;
						}
						const taken = Math.min(remaining, lot.remainingQuantity);
						lot.remainingQuantity -= taken;
						lot.updatedAt = now;
						remaining -= taken;
						const ledgerEntry = new LedgerEntry();
						ledgerEntry.lot = lot;
						ledgerEntry.operation = operation;
						ledgerEntry.quantity = taken;
						ledgerEntry.type = "debit";
						ledgerEntry.createdAt = now;
						ledgerEntries.push(ledgerEntry);
					}
				}

				await manager.save(operation);
				await manager.save(allLots);
				await manager.save(ledgerEntries);
			});

			return { message: "Checkout Successful " };
		} catch (e) {
			if (e instanceof NotFoundException || e instanceof BadRequestException) {
				throw e;
			}
			throw new BadRequestException({
				message: "An error occurred in DB Transaction",
				details: e,
			});
		}
	}
}
