import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LedgerOperationController } from "./ledger-operation.controller";
import { LedgerOperation } from "./ledger-operation.entity";

@Module({
	imports: [TypeOrmModule.forFeature([LedgerOperation])],
	controllers: [LedgerOperationController],
	exports: [TypeOrmModule],
})
export class LedgerOperationModule {}
