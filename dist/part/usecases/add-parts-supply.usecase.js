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
exports.AddPartsSupplyUseCase = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ledger_entry_entity_1 = require("../../ledger-entry/ledger-entry.entity");
const ledger_operation_entity_1 = require("../../ledger-operation/ledger-operation.entity");
const lot_entity_1 = require("../../lot/lot.entity");
const part_manufacturer_entity_1 = require("../../part-manufacturer/part-manufacturer.entity");
const part_supplier_entity_1 = require("../../part-supplier/part-supplier.entity");
const part_entity_1 = require("../part.entity");
let AddPartsSupplyUseCase = class AddPartsSupplyUseCase {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async execute(input) {
        const { partsSupply } = input;
        const { partIds, manufacturerIds, supplierIds } = partsSupply.reduce((acc, { partId, manufacturerId, supplierId }) => {
            acc.partIds.push(partId);
            acc.manufacturerIds.push(manufacturerId);
            acc.supplierIds.push(supplierId);
            return acc;
        }, {
            partIds: [],
            manufacturerIds: [],
            supplierIds: [],
        });
        const partIdsSet = new Set(partIds);
        const manufacturersSet = new Set(manufacturerIds);
        const suppliersSet = new Set(supplierIds);
        const partRepository = this.dataSource.getRepository(part_entity_1.Part);
        const partManufacturerRepository = this.dataSource.getRepository(part_manufacturer_entity_1.PartManufacturer);
        const partSupplierRepository = this.dataSource.getRepository(part_supplier_entity_1.PartSupplier);
        const [parts, manufacturers, suppliers] = await Promise.all([
            partRepository.findBy({ id: (0, typeorm_2.In)(partIds) }),
            partManufacturerRepository.findBy({ id: (0, typeorm_2.In)(manufacturerIds) }),
            partSupplierRepository.findBy({ id: (0, typeorm_2.In)(supplierIds) }),
        ]);
        const foundPartIds = new Set(parts.map((p) => p.id));
        const foundManufacturerIds = new Set(manufacturers.map((m) => m.id));
        const foundSupplierIds = new Set(suppliers.map((s) => s.id));
        const notFoundPartIds = [...partIdsSet].filter((id) => !foundPartIds.has(id));
        const notFoundManufacturerIds = [...manufacturersSet].filter((id) => !foundManufacturerIds.has(id));
        const notFoundSupplierIds = [...suppliersSet].filter((id) => !foundSupplierIds.has(id));
        if (notFoundPartIds.length > 0 ||
            notFoundManufacturerIds.length > 0 ||
            notFoundSupplierIds.length > 0) {
            throw new common_1.NotFoundException({
                message: "Entities Not Found",
                partIds: notFoundPartIds,
                manufacturerIds: notFoundManufacturerIds,
                supplierIds: notFoundSupplierIds,
            });
        }
        const lots = partsSupply.map((supply) => {
            const lot = new lot_entity_1.Lot();
            const partManufacturer = manufacturers.find((manufacturer) => manufacturer.id === supply.manufacturerId);
            const partSupplier = suppliers.find((supplier) => supplier.id === supply.supplierId);
            if (!partManufacturer) {
                throw new Error("Error Manufacturer Not Found");
            }
            if (!partSupplier) {
                throw new Error("Error Supplier Not Found");
            }
            lot.partId = supply.partId;
            lot.partManufacturer = partManufacturer;
            lot.partSupplier = partSupplier;
            lot.initialQuantity = supply.quantity;
            lot.remainingQuantity = supply.quantity;
            lot.unitPrice = supply.unitPrice;
            lot.createdAt = new Date();
            return lot;
        });
        const operation = new ledger_operation_entity_1.LedgerOperation();
        operation.createdAt = new Date();
        operation.type = "entry";
        operation.description = "";
        const ledgerEntries = lots.map((lot) => {
            const ledgerEntry = new ledger_entry_entity_1.LedgerEntry();
            ledgerEntry.lot = lot;
            ledgerEntry.operation = operation;
            ledgerEntry.type = "credit";
            ledgerEntry.quantity = lot.initialQuantity;
            ledgerEntry.createdAt = new Date();
            return ledgerEntry;
        });
        try {
            await this.dataSource.transaction(async (manager) => {
                await manager.save(lots);
                await manager.save(operation);
                await manager.save(ledgerEntries);
            });
        }
        catch (e) {
            throw new common_1.BadRequestException({
                message: "An error occurred in DB Transaction",
                details: e,
            });
        }
    }
};
exports.AddPartsSupplyUseCase = AddPartsSupplyUseCase;
exports.AddPartsSupplyUseCase = AddPartsSupplyUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AddPartsSupplyUseCase);
//# sourceMappingURL=add-parts-supply.usecase.js.map