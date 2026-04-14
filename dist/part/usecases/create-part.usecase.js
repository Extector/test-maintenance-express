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
exports.CreatePartUseCase = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const part_category_entity_1 = require("../../part-category/part-category.entity");
const vehicle_model_entity_1 = require("../../vehicle-model/vehicle-model.entity");
const part_entity_1 = require("../part.entity");
let CreatePartUseCase = class CreatePartUseCase {
    partRepository;
    partCategoryRepository;
    vehicleModelRepository;
    constructor(partRepository, partCategoryRepository, vehicleModelRepository) {
        this.partRepository = partRepository;
        this.partCategoryRepository = partCategoryRepository;
        this.vehicleModelRepository = vehicleModelRepository;
    }
    async execute(input) {
        const part = new part_entity_1.Part();
        part.name = input.name;
        part.description = input.description;
        const partCategory = await this.partCategoryRepository.findOne({
            where: { id: input.partCategoryId },
        });
        if (!partCategory) {
            throw new common_1.NotFoundException({ message: "Part category not found" });
        }
        const vehicleModel = input.vehicleModelId === undefined || input.vehicleModelId === null
            ? null
            : await this.vehicleModelRepository.findOne({
                where: { id: input.vehicleModelId },
            });
        part.partCategory = partCategory;
        part.vehicleModel = vehicleModel ?? null;
        return this.partRepository.save(part);
    }
};
exports.CreatePartUseCase = CreatePartUseCase;
exports.CreatePartUseCase = CreatePartUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(part_entity_1.Part)),
    __param(1, (0, typeorm_1.InjectRepository)(part_category_entity_1.PartCategory)),
    __param(2, (0, typeorm_1.InjectRepository)(vehicle_model_entity_1.VehicleModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CreatePartUseCase);
//# sourceMappingURL=create-part.usecase.js.map