import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LedgerEntryController } from "./ledger-entry.controller";
import { LedgerEntry } from "./ledger-entry.entity";

@Module({
	imports: [TypeOrmModule.forFeature([LedgerEntry])],
	controllers: [LedgerEntryController],
	exports: [TypeOrmModule],
})
export class LedgerEntryModule {}
