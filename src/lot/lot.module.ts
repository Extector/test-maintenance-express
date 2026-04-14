import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LotController } from "./lot.controller";
import { Lot } from "./lot.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Lot])],
	controllers: [LotController],
	exports: [TypeOrmModule],
})
export class LotModule {}
