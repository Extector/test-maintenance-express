"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_config_module_1 = require("./config/app-config.module");
const ledger_entry_entity_1 = require("./ledger-entry/ledger-entry.entity");
const ledger_entry_module_1 = require("./ledger-entry/ledger-entry.module");
const ledger_operation_entity_1 = require("./ledger-operation/ledger-operation.entity");
const ledger_operation_module_1 = require("./ledger-operation/ledger-operation.module");
const lot_entity_1 = require("./lot/lot.entity");
const lot_module_1 = require("./lot/lot.module");
const part_entity_1 = require("./part/part.entity");
const part_module_1 = require("./part/part.module");
const part_category_entity_1 = require("./part-category/part-category.entity");
const part_category_module_1 = require("./part-category/part-category.module");
const part_manufacturer_entity_1 = require("./part-manufacturer/part-manufacturer.entity");
const part_manufacturer_module_1 = require("./part-manufacturer/part-manufacturer.module");
const part_supplier_entity_1 = require("./part-supplier/part-supplier.entity");
const part_supplier_module_1 = require("./part-supplier/part-supplier.module");
const vehicle_model_entity_1 = require("./vehicle-model/vehicle-model.entity");
const vehicle_model_module_1 = require("./vehicle-model/vehicle-model.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_config_module_1.AppConfigModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: (config) => ({
                    type: "postgres",
                    host: config.get("DATABASE_HOST"),
                    port: config.get("DATABASE_PORT"),
                    username: config.get("DATABASE_USERNAME"),
                    password: config.get("DATABASE_PASSWORD"),
                    database: config.get("DATABASE_NAME"),
                    schema: config.get("DATABASE_SCHEMA"),
                    entities: [
                        part_entity_1.Part,
                        lot_entity_1.Lot,
                        part_manufacturer_entity_1.PartManufacturer,
                        part_supplier_entity_1.PartSupplier,
                        part_category_entity_1.PartCategory,
                        vehicle_model_entity_1.VehicleModel,
                        ledger_entry_entity_1.LedgerEntry,
                        ledger_operation_entity_1.LedgerOperation,
                    ],
                    synchronize: false,
                }),
                inject: [config_1.ConfigService],
            }),
            vehicle_model_module_1.VehicleModelModule,
            part_manufacturer_module_1.PartManufacturerModule,
            part_category_module_1.PartCategoryModule,
            part_supplier_module_1.PartSupplierModule,
            lot_module_1.LotModule,
            ledger_entry_module_1.LedgerEntryModule,
            ledger_operation_module_1.LedgerOperationModule,
            part_module_1.PartModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map