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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntry = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const ledger_operation_entity_1 = require("../ledger-operation/ledger-operation.entity");
const lot_entity_1 = require("../lot/lot.entity");
let LedgerEntry = class LedgerEntry {
    id;
    quantity;
    type;
    createdAt;
    lot;
    operation;
};
exports.LedgerEntry = LedgerEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LedgerEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "quantity", type: "int" }),
    __metadata("design:type", Number)
], LedgerEntry.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "created_at", type: "timestamp" }),
    __metadata("design:type", Date)
], LedgerEntry.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lot_entity_1.Lot, (lot) => lot.id),
    (0, typeorm_1.JoinColumn)({ name: "lot_id" }),
    __metadata("design:type", lot_entity_1.Lot)
], LedgerEntry.prototype, "lot", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ledger_operation_entity_1.LedgerOperation, (ledgerOperation) => ledgerOperation.id),
    __metadata("design:type", ledger_operation_entity_1.LedgerOperation)
], LedgerEntry.prototype, "operation", void 0);
exports.LedgerEntry = LedgerEntry = __decorate([
    (0, typeorm_1.Entity)({ name: "ledger_entries " })
], LedgerEntry);
//# sourceMappingURL=ledger-entry.entity.js.map