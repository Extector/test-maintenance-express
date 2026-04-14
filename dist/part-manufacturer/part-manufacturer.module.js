"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartManufacturerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const part_manufacturer_controller_1 = require("./part-manufacturer.controller");
const part_manufacturer_entity_1 = require("./part-manufacturer.entity");
const create_part_manufacturer_usecase_1 = require("./usecases/create-part-manufacturer.usecase");
const list_part_manufacturers_usecase_1 = require("./usecases/list-part-manufacturers.usecase");
let PartManufacturerModule = class PartManufacturerModule {
};
exports.PartManufacturerModule = PartManufacturerModule;
exports.PartManufacturerModule = PartManufacturerModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([part_manufacturer_entity_1.PartManufacturer])],
        controllers: [part_manufacturer_controller_1.PartManufacturerController],
        providers: [list_part_manufacturers_usecase_1.ListPartManufacturersUseCase, create_part_manufacturer_usecase_1.CreatePartManufacturerUseCase],
        exports: [typeorm_1.TypeOrmModule],
    })
], PartManufacturerModule);
//# sourceMappingURL=part-manufacturer.module.js.map