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
exports.PartCategoryController = void 0;
const common_1 = require("@nestjs/common");
const create_part_category_usecase_1 = require("./usecases/create-part-category.usecase");
const list_part_categories_usecase_1 = require("./usecases/list-part-categories.usecase");
let PartCategoryController = class PartCategoryController {
    listPartCategoriesUseCase;
    createPartCategoryUseCase;
    constructor(listPartCategoriesUseCase, createPartCategoryUseCase) {
        this.listPartCategoriesUseCase = listPartCategoriesUseCase;
        this.createPartCategoryUseCase = createPartCategoryUseCase;
    }
    async list() {
        return this.listPartCategoriesUseCase.execute();
    }
    async create(body) {
        return this.createPartCategoryUseCase.execute({ name: body.name });
    }
};
exports.PartCategoryController = PartCategoryController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PartCategoryController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartCategoryController.prototype, "create", null);
exports.PartCategoryController = PartCategoryController = __decorate([
    (0, common_1.Controller)("part-categories"),
    __metadata("design:paramtypes", [list_part_categories_usecase_1.ListPartCategoriesUseCase,
        create_part_category_usecase_1.CreatePartCategoryUseCase])
], PartCategoryController);
//# sourceMappingURL=part-category.controller.js.map