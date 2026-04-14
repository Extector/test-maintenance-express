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
exports.LedgerOperation = void 0;
const typeorm_1 = require("typeorm");
const ledger_entry_entity_1 = require("../ledger-entry/ledger-entry.entity");
let LedgerOperation = class LedgerOperation {
    id;
    type;
    description;
    createdAt;
    parentOperation;
    ledgerEntry;
};
exports.LedgerOperation = LedgerOperation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LedgerOperation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], LedgerOperation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], LedgerOperation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], LedgerOperation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => LedgerOperation, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "parentOperationId" }),
    __metadata("design:type", Object)
], LedgerOperation.prototype, "parentOperation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ledger_entry_entity_1.LedgerEntry, (ledger) => ledger.operation),
    __metadata("design:type", ledger_entry_entity_1.LedgerEntry)
], LedgerOperation.prototype, "ledgerEntry", void 0);
exports.LedgerOperation = LedgerOperation = __decorate([
    (0, typeorm_1.Entity)({ name: "ledger_operations" })
], LedgerOperation);
//# sourceMappingURL=ledger-operation.entity.js.map