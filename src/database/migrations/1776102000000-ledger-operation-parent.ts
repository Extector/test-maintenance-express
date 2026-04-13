import type { MigrationInterface, QueryRunner } from "typeorm";

export class LedgerOperationParent1776102000000 implements MigrationInterface {
	name = "LedgerOperationParent1776102000000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "ledger_operations" ADD "parentOperationId" integer`,
		);
		await queryRunner.query(
			`ALTER TABLE "ledger_operations" ADD CONSTRAINT "FK_ledger_operations_parent" FOREIGN KEY ("parentOperationId") REFERENCES "ledger_operations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "ledger_operations" DROP CONSTRAINT "FK_ledger_operations_parent"`,
		);
		await queryRunner.query(
			`ALTER TABLE "ledger_operations" DROP COLUMN "parentOperationId"`,
		);
	}
}
