import { Router } from "express";
import { In, MoreThan } from "typeorm";
import AppDataSource from "../database/data-source";
import { LedgerEntry, LedgerOperation, Lot, Part } from "../entities";
import {
	lotRepository,
	partCategoryRepository,
	partManufacturerRepository,
	vehicleModelRepository,
} from "../repositories";
import { partSupplierRepository } from "./part-suppliers.router";
export const partsRouter = Router();

export const partRepository = AppDataSource.getRepository(Part);

partsRouter.get("/parts", async (_, res) => {
	const parts = await partRepository.find();
	res.json(parts);
});

partsRouter.post("/parts", async (req, res) => {
	const { name, description, partCategoryId, vehicleModelId } = req.body;
	const part = new Part();

	part.name = name;
	part.description = description;

	const partCategory = await partCategoryRepository.findOne({
		where: { id: partCategoryId },
	});
	const vehicleModel = await vehicleModelRepository.findOne({
		where: { id: vehicleModelId },
	});

	if (!partCategory) {
		return res.status(404).json({ message: "Part category not found" });
	}

	part.partCategory = partCategory;
	part.vehicleModel = vehicleModel;

	await partRepository.save(part);
	res.status(201).json(part);
});

interface SupplyRequest {
	partsSupply: {
		partId: number;
		manufacturerId: number;
		supplierId: number;
		quantity: number;
		unitPrice: number;
	}[];
}

partsRouter.post("/parts/add", async (req, res) => {
	const { partsSupply } = req as unknown as SupplyRequest;

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

	const [parts, manufacturers, suppliers] = await Promise.all([
		partRepository.findBy({ id: In(partIds) }),
		partManufacturerRepository.findBy({ id: In(manufacturerIds) }),
		partSupplierRepository.findBy({ id: In(supplierIds) }),
	]);

	const foundPartIds = new Set(parts.map((p) => p.id));
	const foundManufacturerIds = new Set(manufacturers.map((m) => m.id));
	const foundSupplierIds = new Set(suppliers.map((s) => s.id));

	const notFoundPartIds = [...partIdsSet].filter((id) => !foundPartIds.has(id));
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
		return res.status(404).json({
			message: "Entities Not Found",
			partIds: notFoundPartIds,
			manufacturerIds: notFoundManufacturerIds,
			supplierIds: notFoundSupplierIds,
		});
	}

	const lots = partsSupply.map((supply) => {
		const lot = new Lot();
		const partManufacturer = manufacturers.find(
			(manufacturer) => manufacturer.id === supply.manufacturerId,
		);
		const partSupplier = suppliers.find(
			(supplier) => supplier.id === supply.supplierId,
		);

		if (!partManufacturer) throw new Error("Error Manufacturer Not Found");
		if (!partSupplier) throw new Error("Error Supplier Not Found");

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
		await AppDataSource.transaction(async (manager) => {
			await manager.save(lots);
			await manager.save(operation);
			await manager.save(ledgerEntries);
		});

		res.status(200).send();
	} catch (e) {
		res.status(400).json({
			message: "An error occurred in DB Transaction",
			details: e,
		});
	}
});

interface RemovalRequest {
	description: string;
	partsRemoval: { partId: number; quantity: number }[];
}

partsRouter.post("/parts/remove", async (req, res) => {
	const { partsRemoval, description } = req as unknown as RemovalRequest;

	if (!Array.isArray(partsRemoval) || partsRemoval.length === 0) {
		return res
			.status(400)
			.json({ message: "partsRemoval must be a non-empty array" });
	}

	const aggregatedByPartId = new Map<number, number>();
	for (const { partId, quantity } of partsRemoval) {
		if (!Number.isInteger(quantity) || quantity <= 0) {
			return res
				.status(400)
				.json({ message: "Each quantity must be a positive integer", partId });
		}

		aggregatedByPartId.set(
			partId,
			(aggregatedByPartId.get(partId) ?? 0) + quantity,
		);
	}

	const partIds = [...aggregatedByPartId.keys()];
	const partIdsSet = new Set(partIds);

	try {
		await AppDataSource.transaction(async (manager) => {
			const parts = await manager.find(Part, { where: { id: In(partIds) } });
			if (parts.length !== partIds.length) {
				throw new Error("Entities Not Found");
			}

			const foundPartIds = new Set(parts.map((p) => p.id));
			const notFoundPartIds = [...partIdsSet].filter(
				(id) => !foundPartIds.has(id),
			);

			if (notFoundPartIds.length > 0) {
				return res.status(404).json({
					message: "Entities Not Found",
					partIds: notFoundPartIds,
				});
			}

			const allLots = await lotRepository.find({
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
				return res.status(400).json({
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

		res.status(200).json({ message: "Checkout Successful " });
	} catch (e) {
		res.status(400).json({
			message: "An error occurred in DB Transaction",
			details: e,
		});
	}
});

interface ReturnRequest {
	partsReturn: {
		partId: number;
		referenceOperationId: number;
		reason: string;
		items: { lotId: number; quantity: number }[];
	}[];
}

type ReturnLine = ReturnRequest["partsReturn"][number];

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

partsRouter.post("/parts/return", async (req, res) => {
	const { partsReturn } = req as unknown as ReturnRequest;

	if (!Array.isArray(partsReturn) || partsReturn.length === 0) {
		return res
			.status(400)
			.json({ message: "partsReturn must be a non-empty array" });
	}

	const grouped = groupReturnsByReferenceOperationId(partsReturn);
	const refIdsOrdered = [...grouped.keys()];
	const lotIdsInPayload = new Set<number>();

	try {
		for (const lines of grouped.values()) {
			const { items } = mergeReturnGroup(lines);
			for (const it of items) {
				if (lotIdsInPayload.has(it.lotId)) {
					return res.status(400).json({
						message: "Each lot may appear only once in the request",
						lotId: it.lotId,
					});
				}
				lotIdsInPayload.add(it.lotId);
			}
		}
	} catch {
		return res
			.status(400)
			.json({ message: "Each quantity must be a positive integer" });
	}

	try {
		await AppDataSource.transaction(async (manager) => {
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
				if (!lines) throw new Error("Lines not Found");
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
					if (!lot) throw new Error("Lot Not Found");
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

				if (!parentOperation) throw new Error("Parent Operation Not Found");
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
					if (!lot) throw new Error("Lot not Found");
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

		res.status(200).json({ message: "Return recorded" });
	} catch (e) {
		const err = e instanceof Error ? e.message : String(e);
		if (err.startsWith("REFERENCE_NOT_FOUND:")) {
			return res.status(404).json({
				message: "Reference operation not found",
				operationIds: err
					.replace("REFERENCE_NOT_FOUND:", "")
					.split(",")
					.map(Number),
			});
		}

		if (err.startsWith("REFERENCE_NOT_ENTRY:")) {
			const id = Number(err.replace("REFERENCE_NOT_ENTRY:", ""));
			return res.status(400).json({
				message:
					"referenceOperationId must refer to an entry (receipt) operation",
				operationId: id,
			});
		}

		if (err.startsWith("LOT_NOT_FOUND:")) {
			return res.status(404).json({
				message: "Lot not found",
				lotIds: err.replace("LOT_NOT_FOUND:", "").split(",").map(Number),
			});
		}

		if (err.startsWith("PART_LOT_MISMATCH:")) {
			const [, partId, lotId] = err.split(":");
			return res.status(400).json({
				message: "partId does not match the lot",
				partId: Number(partId),
				lotId: Number(lotId),
			});
		}

		if (err.startsWith("LOT_NOT_IN_RECEIPT:")) {
			const [, opId, lotId] = err.split(":");
			return res.status(400).json({
				message: "Lot is not linked to this receipt operation",
				referenceOperationId: Number(opId),
				lotId: Number(lotId),
			});
		}

		if (err.startsWith("INSUFFICIENT_LOT:")) {
			const [, lotId, requested, available] = err.split(":");
			return res.status(400).json({
				message: "Insufficient remaining quantity in lot",
				lotId: Number(lotId),
				requested: Number(requested),
				available: Number(available),
			});
		}

		res.status(400).json({
			message: "An error occurred in DB Transaction",
			details: e,
		});
	}
});
