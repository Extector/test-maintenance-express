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
exports.Part = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const lot_entity_1 = require("../lot/lot.entity");
const part_category_entity_1 = require("../part-category/part-category.entity");
const vehicle_model_entity_1 = require("../vehicle-model/vehicle-model.entity");
let Part = class Part {
    id;
    name;
    description;
    lots;
    partCategory;
    vehicleModel = null;
};
exports.Part = Part;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Part.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], Part.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: undefined }),
    __metadata("design:type", Object)
], Part.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lot_entity_1.Lot, (lot) => lot.partId),
    __metadata("design:type", Array)
], Part.prototype, "lots", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => part_category_entity_1.PartCategory, (partCategory) => partCategory.id),
    __metadata("design:type", part_category_entity_1.PartCategory)
], Part.prototype, "partCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_model_entity_1.VehicleModel, (vehicleModel) => vehicleModel.id),
    __metadata("design:type", Object)
], Part.prototype, "vehicleModel", void 0);
exports.Part = Part = __decorate([
    (0, typeorm_1.Entity)({ name: "parts" })
], Part);
//# sourceMappingURL=part.entity.js.map