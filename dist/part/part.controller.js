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
exports.PartController = void 0;
const common_1 = require("@nestjs/common");
const add_parts_supply_usecase_1 = require("./usecases/add-parts-supply.usecase");
const create_part_usecase_1 = require("./usecases/create-part.usecase");
const list_parts_usecase_1 = require("./usecases/list-parts.usecase");
const remove_parts_usecase_1 = require("./usecases/remove-parts.usecase");
const return_parts_usecase_1 = require("./usecases/return-parts.usecase");
let PartController = class PartController {
    listPartsUseCase;
    createPartUseCase;
    addPartsSupplyUseCase;
    removePartsUseCase;
    returnPartsUseCase;
    constructor(listPartsUseCase, createPartUseCase, addPartsSupplyUseCase, removePartsUseCase, returnPartsUseCase) {
        this.listPartsUseCase = listPartsUseCase;
        this.createPartUseCase = createPartUseCase;
        this.addPartsSupplyUseCase = addPartsSupplyUseCase;
        this.removePartsUseCase = removePartsUseCase;
        this.returnPartsUseCase = returnPartsUseCase;
    }
    async listParts() {
        return this.listPartsUseCase.execute();
    }
    async createPart(body) {
        return this.createPartUseCase.execute({
            name: body.name,
            description: body.description,
            partCategoryId: body.partCategoryId,
            vehicleModelId: body.vehicleModelId,
        });
    }
    async addPartsSupply(body) {
        await this.addPartsSupplyUseCase.execute({ partsSupply: body.partsSupply });
    }
    async removeParts(body) {
        return this.removePartsUseCase.execute({
            description: body.description,
            partsRemoval: body.partsRemoval,
        });
    }
    async returnParts(body) {
        return this.returnPartsUseCase.execute({ partsReturn: body.partsReturn });
    }
};
exports.PartController = PartController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PartController.prototype, "listParts", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartController.prototype, "createPart", null);
__decorate([
    (0, common_1.Post)("add"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartController.prototype, "addPartsSupply", null);
__decorate([
    (0, common_1.Post)("remove"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartController.prototype, "removeParts", null);
__decorate([
    (0, common_1.Post)("return"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartController.prototype, "returnParts", null);
exports.PartController = PartController = __decorate([
    (0, common_1.Controller)("parts"),
    __metadata("design:paramtypes", [list_parts_usecase_1.ListPartsUseCase,
        create_part_usecase_1.CreatePartUseCase,
        add_parts_supply_usecase_1.AddPartsSupplyUseCase,
        remove_parts_usecase_1.RemovePartsUseCase,
        return_parts_usecase_1.ReturnPartsUseCase])
], PartController);
//# sourceMappingURL=part.controller.js.map