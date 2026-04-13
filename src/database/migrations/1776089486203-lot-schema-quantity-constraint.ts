import type { MigrationInterface, QueryRunner } from "typeorm";

export class LotSchemaQuantityConstraint1776089486203
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			"ALTER TABLE lots ADD CONSTRAINT check_positive_quantity CHECK (remaining_quantity >= 0)",
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			"ALTER TABLE lots DROP CONSTRAINT IF EXISTS check_positive_quantity ",
		);
	}
}
