"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ledger_entry_controller_1 = require("./ledger-entry.controller");
const ledger_entry_entity_1 = require("./ledger-entry.entity");
let LedgerEntryModule = class LedgerEntryModule {
};
exports.LedgerEntryModule = LedgerEntryModule;
exports.LedgerEntryModule = LedgerEntryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ledger_entry_entity_1.LedgerEntry])],
        controllers: [ledger_entry_controller_1.LedgerEntryController],
        exports: [typeorm_1.TypeOrmModule],
    })
], LedgerEntryModule);
//# sourceMappingURL=ledger-entry.module.js.map