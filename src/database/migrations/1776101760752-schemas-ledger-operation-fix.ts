import type { MigrationInterface, QueryRunner } from "typeorm";

export class SchemasLedgerOperationFix1776101760752
	implements MigrationInterface
{
	name = "SchemasLedgerOperationFix1776101760752";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "ledger_operations" ADD "description" character varying NOT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "ledger_operations" DROP COLUMN "description"`,
		);
	}
}
