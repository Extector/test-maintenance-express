"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ledger_entry_entity_1 = require("../ledger-entry/ledger-entry.entity");
const ledger_operation_entity_1 = require("../ledger-operation/ledger-operation.entity");
const lot_entity_1 = require("../lot/lot.entity");
const part_category_entity_1 = require("../part-category/part-category.entity");
const part_manufacturer_entity_1 = require("../part-manufacturer/part-manufacturer.entity");
const part_supplier_entity_1 = require("../part-supplier/part-supplier.entity");
const vehicle_model_entity_1 = require("../vehicle-model/vehicle-model.entity");
const part_controller_1 = require("./part.controller");
const part_entity_1 = require("./part.entity");
const add_parts_supply_usecase_1 = require("./usecases/add-parts-supply.usecase");
const create_part_usecase_1 = require("./usecases/create-part.usecase");
const list_parts_usecase_1 = require("./usecases/list-parts.usecase");
const remove_parts_usecase_1 = require("./usecases/remove-parts.usecase");
const return_parts_usecase_1 = require("./usecases/return-parts.usecase");
let PartModule = class PartModule {
};
exports.PartModule = PartModule;
exports.PartModule = PartModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                part_entity_1.Part,
                lot_entity_1.Lot,
                ledger_entry_entity_1.LedgerEntry,
                ledger_operation_entity_1.LedgerOperation,
                part_category_entity_1.PartCategory,
                vehicle_model_entity_1.VehicleModel,
                part_manufacturer_entity_1.PartManufacturer,
                part_supplier_entity_1.PartSupplier,
            ]),
        ],
        controllers: [part_controller_1.PartController],
        providers: [
            list_parts_usecase_1.ListPartsUseCase,
            create_part_usecase_1.CreatePartUseCase,
            add_parts_supply_usecase_1.AddPartsSupplyUseCase,
            remove_parts_usecase_1.RemovePartsUseCase,
            return_parts_usecase_1.ReturnPartsUseCase,
        ],
    })
], PartModule);
//# sourceMappingURL=part.module.js.map