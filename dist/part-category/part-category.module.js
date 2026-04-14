"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartCategoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const part_category_controller_1 = require("./part-category.controller");
const part_category_entity_1 = require("./part-category.entity");
const create_part_category_usecase_1 = require("./usecases/create-part-category.usecase");
const list_part_categories_usecase_1 = require("./usecases/list-part-categories.usecase");
let PartCategoryModule = class PartCategoryModule {
};
exports.PartCategoryModule = PartCategoryModule;
exports.PartCategoryModule = PartCategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([part_category_entity_1.PartCategory])],
        controllers: [part_category_controller_1.PartCategoryController],
        providers: [list_part_categories_usecase_1.ListPartCategoriesUseCase, create_part_category_usecase_1.CreatePartCategoryUseCase],
        exports: [typeorm_1.TypeOrmModule],
    })
], PartCategoryModule);
//# sourceMappingURL=part-category.module.js.map