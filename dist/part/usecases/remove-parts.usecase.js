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
exports.RemovePartsUseCase = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ledger_entry_entity_1 = require("../../ledger-entry/ledger-entry.entity");
const ledger_operation_entity_1 = require("../../ledger-operation/ledger-operation.entity");
const lot_entity_1 = require("../../lot/lot.entity");
const part_entity_1 = require("../part.entity");
let RemovePartsUseCase = class RemovePartsUseCase {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async execute(input) {
        const { partsRemoval, description } = input;
        if (!Array.isArray(partsRemoval) || partsRemoval.length === 0) {
            throw new common_1.BadRequestException({
                message: "partsRemoval must be a non-empty array",
            });
        }
        const aggregatedByPartId = new Map();
        for (const { partId, quantity } of partsRemoval) {
            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new common_1.BadRequestException({
                    message: "Each quantity must be a positive integer",
                    partId,
                });
            }
            aggregatedByPartId.set(partId, (aggregatedByPartId.get(partId) ?? 0) + quantity);
        }
        const partIds = [...aggregatedByPartId.keys()];
        const partIdsSet = new Set(partIds);
        try {
            await this.dataSource.transaction(async (manager) => {
                const parts = await manager.find(part_entity_1.Part, { where: { id: (0, typeorm_2.In)(partIds) } });
                if (parts.length !== partIds.length) {
                    const foundPartIds = new Set(parts.map((p) => p.id));
                    const notFoundPartIds = [...partIdsSet].filter((id) => !foundPartIds.has(id));
                    throw new common_1.NotFoundException({
                        message: "Entities Not Found",
                        partIds: notFoundPartIds,
                    });
                }
                const lotRepo = manager.getRepository(lot_entity_1.Lot);
                const allLots = await lotRepo.find({
                    where: { partId: (0, typeorm_2.In)(partIds), remainingQuantity: (0, typeorm_2.MoreThan)(0) },
                    order: { createdAt: "ASC" },
                    lock: { mode: "pessimistic_write" },
                });
                const lotsByPartId = new Map();
                for (const lot of allLots) {
                    const list = lotsByPartId.get(lot.partId) ?? [];
                    list.push(lot);
                    lotsByPartId.set(lot.partId, list);
                }
                const insufficient = [];
                for (const [partId, requested] of aggregatedByPartId) {
                    const lotsForPart = lotsByPartId.get(partId) ?? [];
                    const available = lotsForPart.reduce((sum, lot) => sum + lot.remainingQuantity, 0);
                    if (available < requested) {
                        insufficient.push({ partId, requested, available });
                    }
                }
                if (insufficient.length > 0) {
                    throw new common_1.BadRequestException({
                        message: "Insufficient stock in lots for one or more parts",
                        details: insufficient,
                    });
                }
                const operation = new ledger_operation_entity_1.LedgerOperation();
                operation.createdAt = new Date();
                operation.type = "exit";
                operation.description = description;
                const ledgerEntries = [];
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
                        const ledgerEntry = new ledger_entry_entity_1.LedgerEntry();
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
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.BadRequestException) {
                throw e;
            }
            throw new common_1.BadRequestException({
                message: "An error occurred in DB Transaction",
                details: e,
            });
        }
    }
};
exports.RemovePartsUseCase = RemovePartsUseCase;
exports.RemovePartsUseCase = RemovePartsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], RemovePartsUseCase);
//# sourceMappingURL=remove-parts.usecase.js.map