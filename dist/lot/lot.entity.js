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
exports.Lot = void 0;
const typeorm_1 = require("typeorm");
const part_entity_1 = require("../part/part.entity");
const part_manufacturer_entity_1 = require("../part-manufacturer/part-manufacturer.entity");
const part_supplier_entity_1 = require("../part-supplier/part-supplier.entity");
let Lot = class Lot {
    id;
    partId;
    initialQuantity;
    remainingQuantity;
    unitPrice;
    createdAt;
    updatedAt;
    partManufacturer;
    partSupplier;
    part;
};
exports.Lot = Lot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Lot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "part_id", type: "int" }),
    __metadata("design:type", Number)
], Lot.prototype, "partId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "initial_quantity", type: "int" }),
    __metadata("design:type", Number)
], Lot.prototype, "initialQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "remaining_quantity", type: "int" }),
    __metadata("design:type", Number)
], Lot.prototype, "remainingQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "unit_price", type: "float" }),
    __metadata("design:type", Number)
], Lot.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "created_at", type: "timestamp" }),
    __metadata("design:type", Date)
], Lot.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "updated_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Object)
], Lot.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => part_manufacturer_entity_1.PartManufacturer, (partManufacturer) => partManufacturer.id),
    __metadata("design:type", part_manufacturer_entity_1.PartManufacturer)
], Lot.prototype, "partManufacturer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => part_supplier_entity_1.PartSupplier, (partSupplier) => partSupplier.id),
    __metadata("design:type", part_supplier_entity_1.PartSupplier)
], Lot.prototype, "partSupplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => part_entity_1.Part, (part) => part.id),
    __metadata("design:type", part_entity_1.Part)
], Lot.prototype, "part", void 0);
exports.Lot = Lot = __decorate([
    (0, typeorm_1.Entity)({
        name: "lots",
    })
], Lot);
//# sourceMappingURL=lot.entity.js.map