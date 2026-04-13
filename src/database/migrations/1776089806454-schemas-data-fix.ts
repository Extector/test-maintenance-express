import type { MigrationInterface, QueryRunner } from "typeorm";

export class SchemasDataFix1776089806454 implements MigrationInterface {
	name = "SchemasDataFix1776089806454";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "lots" DROP CONSTRAINT "check_positive_quantity"`,
		);
		await queryRunner.query(
			`ALTER TABLE "ledger_entries " RENAME COLUMN "createdAt" TO "created_at"`,
		);
		await queryRunner.query(
			`ALTER TABLE "lots" ADD "created_at" TIMESTAMP NOT NULL`,
		);
		await queryRunner.query(`ALTER TABLE "lots" ADD "updated_at" TIMESTAMP`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "lots" DROP COLUMN "updated_at"`);
		await queryRunner.query(`ALTER TABLE "lots" DROP COLUMN "created_at"`);
		await queryRunner.query(
			`ALTER TABLE "ledger_entries " RENAME COLUMN "created_at" TO "createdAt"`,
		);
		await queryRunner.query(
			`ALTER TABLE "lots" ADD CONSTRAINT "check_positive_quantity" CHECK ((remaining_quantity >= 0))`,
		);
	}
}
