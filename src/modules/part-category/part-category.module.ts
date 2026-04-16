import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartCategoryController } from "./part-category.controller";
import { PartCategory } from "./part-category.entity";
import { CreatePartCategoryUseCase } from "./usecases/create-part-category.usecase";
import { ListPartCategoriesUseCase } from "./usecases/list-part-categories.usecase";

@Module({
	imports: [TypeOrmModule.forFeature([PartCategory])],
	controllers: [PartCategoryController],
	providers: [ListPartCategoriesUseCase, CreatePartCategoryUseCase],
	exports: [TypeOrmModule],
})
export class PartCategoryModule {}
