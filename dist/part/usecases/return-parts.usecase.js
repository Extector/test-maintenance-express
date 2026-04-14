"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnPartsUseCase = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ledger_entry_entity_1 = require("../../ledger-entry/ledger-entry.entity");
const ledger_operation_entity_1 = require("../../ledger-operation/ledger-operation.entity");
const lot_entity_1 = require("../../lot/lot.entity");
function groupReturnsByReferenceOperationId(partsReturn) {
    const byRef = new Map();
    for (const row of partsReturn) {
        const list = byRef.get(row.referenceOperationId) ?? [];
        list.push(row);
        byRef.set(row.referenceOperationId, list);
    }
    return byRef;
}
function mergeReturnGroup(lines) {
    const reasonParts = [];
    const itemMap = new Map();
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
    const description = [...new Set(reasonParts.map((r) => r.trim()).filter(Boolean))].join("; ") ||
        "Return to supplier";
    return { description, items: [...itemMap.values()] };
}
let ReturnPartsUseCase = class ReturnPartsUseCase {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async execute(input) {
        const { partsReturn } = input;
        if (!Array.isArray(partsReturn) || partsReturn.length === 0) {
            throw new common_1.BadRequestException({
                message: "partsReturn must be a non-empty array",
            });
        }
        const grouped = groupReturnsByReferenceOperationId(partsReturn);
        const refIdsOrdered = [...grouped.keys()];
        const lotIdsInPayload = new Set();
        try {
            for (const lines of grouped.values()) {
                const { items } = mergeReturnGroup(lines);
                for (const it of items) {
                    if (lotIdsInPayload.has(it.lotId)) {
                        throw new common_1.BadRequestException({
                            message: "Each lot may appear only once in the request",
                            lotId: it.lotId,
                        });
                    }
                    lotIdsInPayload.add(it.lotId);
                }
            }
        }
        catch {
            throw new common_1.BadRequestException({
                message: "Each quantity must be a positive integer",
            });
        }
        try {
            await this.dataSource.transaction(async (manager) => {
                const ledgerEntryRepo = manager.getRepository(ledger_entry_entity_1.LedgerEntry);
                const lotRepo = manager.getRepository(lot_entity_1.Lot);
                const referenceOperations = await manager.find(ledger_operation_entity_1.LedgerOperation, {
                    where: { id: (0, typeorm_2.In)(refIdsOrdered) },
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
                const allMerged = [];
                for (const refId of refIdsOrdered) {
                    const lines = grouped.get(refId);
                    if (!lines) {
                        throw new Error("Lines not Found");
                    }
                    allMerged.push({ refId, ...mergeReturnGroup(lines) });
                }
                const allLotIds = [...lotIdsInPayload];
                const lots = await lotRepo.find({
                    where: { id: (0, typeorm_2.In)(allLotIds) },
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
                            throw new Error(`INSUFFICIENT_LOT:${item.lotId}:${item.quantity}:${lot.remainingQuantity}`);
                        }
                    }
                }
                const returnOperations = [];
                for (let i = 0; i < refIdsOrdered.length; i++) {
                    const refId = refIdsOrdered[i];
                    const parentOperation = refById.get(refId);
                    const { description } = allMerged[i];
                    const retOp = new ledger_operation_entity_1.LedgerOperation();
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
                const ledgerEntries = [];
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
                        const ledgerEntry = new ledger_entry_entity_1.LedgerEntry();
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
        }
        catch (e) {
            const err = e instanceof Error ? e.message : String(e);
            if (err.startsWith("REFERENCE_NOT_FOUND:")) {
                throw new common_1.NotFoundException({
                    message: "Reference operation not found",
                    operationIds: err
                        .replace("REFERENCE_NOT_FOUND:", "")
                        .split(",")
                        .map(Number),
                });
            }
            if (err.startsWith("REFERENCE_NOT_ENTRY:")) {
                const id = Number(err.replace("REFERENCE_NOT_ENTRY:", ""));
                throw new common_1.BadRequestException({
                    message: "referenceOperationId must refer to an entry (receipt) operation",
                    operationId: id,
                });
            }
            if (err.startsWith("LOT_NOT_FOUND:")) {
                throw new common_1.NotFoundException({
                    message: "Lot not found",
                    lotIds: err.replace("LOT_NOT_FOUND:", "").split(",").map(Number),
                });
            }
            if (err.startsWith("PART_LOT_MISMATCH:")) {
                const [, partId, lotId] = err.split(":");
                throw new common_1.BadRequestException({
                    message: "partId does not match the lot",
                    partId: Number(partId),
                    lotId: Number(lotId),
                });
            }
            if (err.startsWith("LOT_NOT_IN_RECEIPT:")) {
                const [, opId, lotId] = err.split(":");
                throw new common_1.BadRequestException({
                    message: "Lot is not linked to this receipt operation",
                    referenceOperationId: Number(opId),
                    lotId: Number(lotId),
                });
            }
            if (err.startsWith("INSUFFICIENT_LOT:")) {
                const [, lotId, requested, available] = err.split(":");
                throw new common_1.BadRequestException({
                    message: "Insufficient remaining quantity in lot",
                    lotId: Number(lotId),
                    requested: Number(requested),
                    available: Number(available),
                });
            }
            if (e instanceof common_1.BadRequestException || e instanceof common_1.NotFoundException) {
                throw e;
            }
            throw new common_1.BadRequestException({
                message: "An error occurred in DB Transaction",
                details: e,
            });
        }
    }
};
exports.ReturnPartsUseCase = ReturnPartsUseCase;
exports.ReturnPartsUseCase = ReturnPartsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ReturnPartsUseCase);
//# sourceMappingURL=return-parts.usecase.js.map