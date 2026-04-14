"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartSupplierModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const part_supplier_controller_1 = require("./part-supplier.controller");
const part_supplier_entity_1 = require("./part-supplier.entity");
const create_part_supplier_usecase_1 = require("./usecases/create-part-supplier.usecase");
const list_part_suppliers_usecase_1 = require("./usecases/list-part-suppliers.usecase");
let PartSupplierModule = class PartSupplierModule {
};
exports.PartSupplierModule = PartSupplierModule;
exports.PartSupplierModule = PartSupplierModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([part_supplier_entity_1.PartSupplier])],
        controllers: [part_supplier_controller_1.PartSupplierController],
        providers: [list_part_suppliers_usecase_1.ListPartSuppliersUseCase, create_part_supplier_usecase_1.CreatePartSupplierUseCase],
        exports: [typeorm_1.TypeOrmModule],
    })
], PartSupplierModule);
//# sourceMappingURL=part-supplier.module.js.map