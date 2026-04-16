import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1776270337347 implements MigrationInterface {
    name = 'Migrations1776270337347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."ledger_operations" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "parentOperationId" integer, CONSTRAINT "PK_398509d50d06f3c6ef779ecc5d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."part_manufacturers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c657f336dd64347aa5147408f84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."part_suppliers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_76459374c8f8dad3277e46a5d37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."part_categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_6070cc11099e9ef60593846832c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."vehicle_models" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_1c01752184334fdbcae9bbaa67f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."parts" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "something" character varying NOT NULL, "partCategoryId" integer, "vehicleModelId" integer, CONSTRAINT "PK_daa5595bb8933f49ac00c9ebc79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."lots" ("id" SERIAL NOT NULL, "part_id" integer NOT NULL, "initial_quantity" integer NOT NULL, "remaining_quantity" integer NOT NULL, "unit_price" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP, "partManufacturerId" integer, "partSupplierId" integer, "partId" integer, CONSTRAINT "PK_2bb990a4015865cb1daa1d22fd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."ledger_entries " ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "lot_id" integer, "operationId" integer, CONSTRAINT "PK_33ee16c111c69f3df2be7a63653" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."ledger_operations" ADD CONSTRAINT "FK_c6a74be8041b4ec2c3228fc24e0" FOREIGN KEY ("parentOperationId") REFERENCES "public"."ledger_operations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."parts" ADD CONSTRAINT "FK_d41e654b85e1986aa03ebefb99c" FOREIGN KEY ("partCategoryId") REFERENCES "public"."part_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."parts" ADD CONSTRAINT "FK_21c8d9071137b5d9eaeec3bae83" FOREIGN KEY ("vehicleModelId") REFERENCES "public"."vehicle_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."lots" ADD CONSTRAINT "FK_754fef72c787cad34ad0b3f26e7" FOREIGN KEY ("partManufacturerId") REFERENCES "public"."part_manufacturers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."lots" ADD CONSTRAINT "FK_2b5f4d10997c4c2be532ac4ca49" FOREIGN KEY ("partSupplierId") REFERENCES "public"."part_suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."lots" ADD CONSTRAINT "FK_656f5aa3730ca31858d31516f07" FOREIGN KEY ("partId") REFERENCES "public"."parts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."ledger_entries " ADD CONSTRAINT "FK_c40210b1d7ac0343d570c945794" FOREIGN KEY ("lot_id") REFERENCES "public"."lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."ledger_entries " ADD CONSTRAINT "FK_f7635487c9371526e84d671781d" FOREIGN KEY ("operationId") REFERENCES "public"."ledger_operations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."ledger_entries " DROP CONSTRAINT "FK_f7635487c9371526e84d671781d"`);
        await queryRunner.query(`ALTER TABLE "public"."ledger_entries " DROP CONSTRAINT "FK_c40210b1d7ac0343d570c945794"`);
        await queryRunner.query(`ALTER TABLE "public"."lots" DROP CONSTRAINT "FK_656f5aa3730ca31858d31516f07"`);
        await queryRunner.query(`ALTER TABLE "public"."lots" DROP CONSTRAINT "FK_2b5f4d10997c4c2be532ac4ca49"`);
        await queryRunner.query(`ALTER TABLE "public"."lots" DROP CONSTRAINT "FK_754fef72c787cad34ad0b3f26e7"`);
        await queryRunner.query(`ALTER TABLE "public"."parts" DROP CONSTRAINT "FK_21c8d9071137b5d9eaeec3bae83"`);
        await queryRunner.query(`ALTER TABLE "public"."parts" DROP CONSTRAINT "FK_d41e654b85e1986aa03ebefb99c"`);
        await queryRunner.query(`ALTER TABLE "public"."ledger_operations" DROP CONSTRAINT "FK_c6a74be8041b4ec2c3228fc24e0"`);
        await queryRunner.query(`DROP TABLE "public"."ledger_entries "`);
        await queryRunner.query(`DROP TABLE "public"."lots"`);
        await queryRunner.query(`DROP TABLE "public"."parts"`);
        await queryRunner.query(`DROP TABLE "public"."vehicle_models"`);
        await queryRunner.query(`DROP TABLE "public"."part_categories"`);
        await queryRunner.query(`DROP TABLE "public"."part_suppliers"`);
        await queryRunner.query(`DROP TABLE "public"."part_manufacturers"`);
        await queryRunner.query(`DROP TABLE "public"."ledger_operations"`);
    }

}
