import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1776270409833 implements MigrationInterface {
    name = 'Migrations1776270409833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ledger_operations" DROP CONSTRAINT "FK_ledger_operations_parent"`);
        await queryRunner.query(`ALTER TABLE "parts" ADD "something" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ledger_operations" ADD CONSTRAINT "FK_c6a74be8041b4ec2c3228fc24e0" FOREIGN KEY ("parentOperationId") REFERENCES "ledger_operations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ledger_operations" DROP CONSTRAINT "FK_c6a74be8041b4ec2c3228fc24e0"`);
        await queryRunner.query(`ALTER TABLE "parts" DROP COLUMN "something"`);
        await queryRunner.query(`ALTER TABLE "ledger_operations" ADD CONSTRAINT "FK_ledger_operations_parent" FOREIGN KEY ("parentOperationId") REFERENCES "ledger_operations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
