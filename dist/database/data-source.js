"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const node_path_1 = __importDefault(require("node:path"));
const typeorm_1 = require("typeorm");
const ledger_entry_entity_1 = require("../ledger-entry/ledger-entry.entity");
const ledger_operation_entity_1 = require("../ledger-operation/ledger-operation.entity");
const lot_entity_1 = require("../lot/lot.entity");
const part_entity_1 = require("../part/part.entity");
const part_category_entity_1 = require("../part-category/part-category.entity");
const part_manufacturer_entity_1 = require("../part-manufacturer/part-manufacturer.entity");
const part_supplier_entity_1 = require("../part-supplier/part-supplier.entity");
const vehicle_model_entity_1 = require("../vehicle-model/vehicle-model.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USERNAME ?? "postgres",
    password: process.env.DATABASE_PASSWORD ?? "postgres",
    database: process.env.DATABASE_NAME ?? "stock-poc",
    schema: process.env.DATABASE_SCHEMA ?? "public",
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
    migrations: [node_path_1.default.join(__dirname, "migrations", "*.ts")],
});
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map