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
exports.PartManufacturer = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const lot_entity_1 = require("../lot/lot.entity");
let PartManufacturer = class PartManufacturer {
    id;
    name;
    description;
    lots;
};
exports.PartManufacturer = PartManufacturer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PartManufacturer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], PartManufacturer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: undefined }),
    __metadata("design:type", Object)
], PartManufacturer.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lot_entity_1.Lot, (lot) => lot.partManufacturer),
    __metadata("design:type", Array)
], PartManufacturer.prototype, "lots", void 0);
exports.PartManufacturer = PartManufacturer = __decorate([
    (0, typeorm_1.Entity)({ name: "part_manufacturers" })
], PartManufacturer);
//# sourceMappingURL=part-manufacturer.entity.js.map