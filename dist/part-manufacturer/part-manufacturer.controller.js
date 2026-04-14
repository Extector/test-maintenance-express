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
exports.PartManufacturerController = void 0;
const common_1 = require("@nestjs/common");
const create_part_manufacturer_usecase_1 = require("./usecases/create-part-manufacturer.usecase");
const list_part_manufacturers_usecase_1 = require("./usecases/list-part-manufacturers.usecase");
let PartManufacturerController = class PartManufacturerController {
    listPartManufacturersUseCase;
    createPartManufacturerUseCase;
    constructor(listPartManufacturersUseCase, createPartManufacturerUseCase) {
        this.listPartManufacturersUseCase = listPartManufacturersUseCase;
        this.createPartManufacturerUseCase = createPartManufacturerUseCase;
    }
    async list() {
        return this.listPartManufacturersUseCase.execute();
    }
    async create(body) {
        return this.createPartManufacturerUseCase.execute({ name: body.name });
    }
};
exports.PartManufacturerController = PartManufacturerController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PartManufacturerController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartManufacturerController.prototype, "create", null);
exports.PartManufacturerController = PartManufacturerController = __decorate([
    (0, common_1.Controller)("manufacturers"),
    __metadata("design:paramtypes", [list_part_manufacturers_usecase_1.ListPartManufacturersUseCase,
        create_part_manufacturer_usecase_1.CreatePartManufacturerUseCase])
], PartManufacturerController);
//# sourceMappingURL=part-manufacturer.controller.js.map