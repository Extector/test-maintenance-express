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

export interface ReturnPartItem {
	partId: number;
	referenceOperationId: number;
	reason: string;
	items: { lotId: number; quantity: number }[];
}

export interface ReturnPartsInput {
	partsReturn: ReturnPartItem[];
}

type ReturnLine = ReturnPartItem;

function groupReturnsByReferenceOperationId(partsReturn: ReturnLine[]) {
	const byRef = new Map<number, ReturnLine[]>();
	for (const row of partsReturn) {
		const list = byRef.get(row.referenceOperationId) ?? [];
		list.push(row);
		byRef.set(row.referenceOperationId, list);
	}
	return byRef;
}

function mergeReturnGroup(lines: ReturnLine[]) {
	const reasonParts: string[] = [];
	const itemMap = new Map<
		string,
		{ partId: number; lotId: number; quantity: number }
	>();
	for (const line of lines) {
		reasonParts.push(line.reason);
		for (const it of line.items) {
			if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
				throw new Error(`INVALID_QUANTITY:${line.partId}:${it.lotId}`);
			}
			const key = `${line.partId}:${it.lotId}`;
			const prev = itemMap.get(key);
			itemMap.set(key, {
				partId: line.partId,
				lotId: it.lotId,
				quantity: (prev?.quantity ?? 0) + it.quantity,
			});
		}
	}
	const description =
		[...new Set(reasonParts.map((r) => r.trim()).filter(Boolean))].join("; ") ||
		"Return to supplier";
	return { description, items: [...itemMap.values()] };
}

@Injectable()
export class ReturnPartsUseCase {
	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async execute(input: ReturnPartsInput): Promise<{ message: string }> {
		const { partsReturn } = input;

		if (!Array.isArray(partsReturn) || partsReturn.length === 0) {
			throw new BadRequestException({
				message: "partsReturn must be a non-empty array",
			});
		}

		const grouped = groupReturnsByReferenceOperationId(partsReturn);
		const refIdsOrdered = [...grouped.keys()];
		const lotIdsInPayload = new Set<number>();

		try {
			for (const lines of grouped.values()) {
				const { items } = mergeReturnGroup(lines);
				for (const it of items) {
					if (lotIdsInPayload.has(it.lotId)) {
						throw new BadRequestException({
							message: "Each lot may appear only once in the request",
							lotId: it.lotId,
						});
					}
					lotIdsInPayload.add(it.lotId);
				}
			}
		} catch {
			throw new BadRequestException({
				message: "Each quantity must be a positive integer",
			});
		}

		try {
			await this.dataSource.transaction(async (manager) => {
				const ledgerEntryRepo = manager.getRepository(LedgerEntry);
				const lotRepo = manager.getRepository(Lot);

				const referenceOperations = await manager.find(LedgerOperation, {
					where: { id: In(refIdsOrdered) },
				});

				if (referenceOperations.length !== refIdsOrdered.length) {
					const found = new Set(referenceOperations.map((o) => o.id));
					const missing = refIdsOrdered.filter((id) => !found.has(id));
					throw new Error(`REFERENCE_NOT_FOUND:${missing.join(",")}`);
				}

				for (const op of referenceOperations) {
					if (op.type !== "entry") {
						throw new Error(`REFERENCE_NOT_ENTRY:${op.id}`);
					}
				}

				const refById = new Map(referenceOperations.map((o) => [o.id, o]));

				const allMerged: {
					refId: number;
					description: string;
					items: ReturnType<typeof mergeReturnGroup>["items"];
				}[] = [];
				for (const refId of refIdsOrdered) {
					const lines = grouped.get(refId);
					if (!lines) {
						throw new Error("Lines not Found");
					}
					allMerged.push({ refId, ...mergeReturnGroup(lines) });
				}

				const allLotIds = [...lotIdsInPayload];
				const lots = await lotRepo.find({
					where: { id: In(allLotIds) },
					lock: { mode: "pessimistic_write" },
				});

				if (lots.length !== allLotIds.length) {
					const foundLots = new Set(lots.map((l) => l.id));
					const missingLots = allLotIds.filter((id) => !foundLots.has(id));
					throw new Error(`LOT_NOT_FOUND:${missingLots.join(",")}`);
				}

				const lotById = new Map(lots.map((l) => [l.id, l]));
				const now = new Date();

				for (const { refId, items } of allMerged) {
					for (const item of items) {
						const lot = lotById.get(item.lotId);
						if (!lot) {
							throw new Error("Lot Not Found");
						}
						if (lot.partId !== item.partId) {
							throw new Error(`PART_LOT_MISMATCH:${item.partId}:${item.lotId}`);
						}

						const credit = await ledgerEntryRepo.findOne({
							where: {
								type: "credit",
								operation: { id: refId },
								lot: { id: item.lotId },
							},
							relations: ["operation", "lot"],
						});

						if (!credit) {
							throw new Error(`LOT_NOT_IN_RECEIPT:${refId}:${item.lotId}`);
						}

						if (lot.remainingQuantity < item.quantity) {
							throw new Error(
								`INSUFFICIENT_LOT:${item.lotId}:${item.quantity}:${lot.remainingQuantity}`,
							);
						}
					}
				}

				const returnOperations: LedgerOperation[] = [];
				for (let i = 0; i < refIdsOrdered.length; i++) {
					const refId = refIdsOrdered[i];
					const parentOperation = refById.get(refId);
					const { description } = allMerged[i];
					const retOp = new LedgerOperation();

					if (!parentOperation) {
						throw new Error("Parent Operation Not Found");
					}
					retOp.type = "return_to_supplier";
					retOp.description = description;
					retOp.createdAt = now;
					retOp.parentOperation = parentOperation;
					returnOperations.push(retOp);
				}

				const savedReturns = await manager.save(returnOperations);
				const ledgerEntries: LedgerEntry[] = [];

				for (let i = 0; i < refIdsOrdered.length; i++) {
					const returnOp = savedReturns[i];
					const merged = allMerged[i];
					for (const item of merged.items) {
						const lot = lotById.get(item.lotId);
						if (!lot) {
							throw new Error("Lot not Found");
						}
						lot.remainingQuantity -= item.quantity;
						lot.updatedAt = now;
						const ledgerEntry = new LedgerEntry();
						ledgerEntry.lot = lot;
						ledgerEntry.operation = returnOp;
						ledgerEntry.quantity = item.quantity;
						ledgerEntry.type = "debit";
						ledgerEntry.createdAt = now;
						ledgerEntries.push(ledgerEntry);
					}
				}

				await manager.save(lots);
				await manager.save(ledgerEntries);
			});

			return { message: "Return recorded" };
		} catch (e) {
			const err = e instanceof Error ? e.message : String(e);
			if (err.startsWith("REFERENCE_NOT_FOUND:")) {
				throw new NotFoundException({
					message: "Reference operation not found",
					operationIds: err
						.replace("REFERENCE_NOT_FOUND:", "")
						.split(",")
						.map(Number),
				});
			}

			if (err.startsWith("REFERENCE_NOT_ENTRY:")) {
				const id = Number(err.replace("REFERENCE_NOT_ENTRY:", ""));
				throw new BadRequestException({
					message:
						"referenceOperationId must refer to an entry (receipt) operation",
					operationId: id,
				});
			}

			if (err.startsWith("LOT_NOT_FOUND:")) {
				throw new NotFoundException({
					message: "Lot not found",
					lotIds: err.replace("LOT_NOT_FOUND:", "").split(",").map(Number),
				});
			}

			if (err.startsWith("PART_LOT_MISMATCH:")) {
				const [, partId, lotId] = err.split(":");
				throw new BadRequestException({
					message: "partId does not match the lot",
					partId: Number(partId),
					lotId: Number(lotId),
				});
			}

			if (err.startsWith("LOT_NOT_IN_RECEIPT:")) {
				const [, opId, lotId] = err.split(":");
				throw new BadRequestException({
					message: "Lot is not linked to this receipt operation",
					referenceOperationId: Number(opId),
					lotId: Number(lotId),
				});
			}

			if (err.startsWith("INSUFFICIENT_LOT:")) {
				const [, lotId, requested, available] = err.split(":");
				throw new BadRequestException({
					message: "Insufficient remaining quantity in lot",
					lotId: Number(lotId),
					requested: Number(requested),
					available: Number(available),
				});
			}

			if (e instanceof BadRequestException || e instanceof NotFoundException) {
				throw e;
			}

			throw new BadRequestException({
				message: "An error occurred in DB Transaction",
				details: e,
			});
		}
	}
}
