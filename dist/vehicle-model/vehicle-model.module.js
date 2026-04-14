"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModelModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const create_vehicle_model_usecase_1 = require("./usecases/create-vehicle-model.usecase");
const list_vehicle_models_usecase_1 = require("./usecases/list-vehicle-models.usecase");
const vehicle_model_controller_1 = require("./vehicle-model.controller");
const vehicle_model_entity_1 = require("./vehicle-model.entity");
let VehicleModelModule = class VehicleModelModule {
};
exports.VehicleModelModule = VehicleModelModule;
exports.VehicleModelModule = VehicleModelModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vehicle_model_entity_1.VehicleModel])],
        controllers: [vehicle_model_controller_1.VehicleModelController],
        providers: [list_vehicle_models_usecase_1.ListVehicleModelsUseCase, create_vehicle_model_usecase_1.CreateVehicleModelUseCase],
        exports: [typeorm_1.TypeOrmModule],
    })
], VehicleModelModule);
//# sourceMappingURL=vehicle-model.module.js.map