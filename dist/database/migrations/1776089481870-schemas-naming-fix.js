"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemasNamingFix1776089481870 = void 0;
class SchemasNamingFix1776089481870 {
    name = "SchemasNamingFix1776089481870";
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "part_manufacturers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c657f336dd64347aa5147408f84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "part_suppliers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_76459374c8f8dad3277e46a5d37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "part_categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_6070cc11099e9ef60593846832c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle_models" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_1c01752184334fdbcae9bbaa67f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parts" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "partCategoryId" integer, "vehicleModelId" integer, CONSTRAINT "PK_daa5595bb8933f49ac00c9ebc79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lots" ("id" SERIAL NOT NULL, "part_id" integer NOT NULL, "initial_quantity" integer NOT NULL, "remaining_quantity" integer NOT NULL, "unit_price" double precision NOT NULL, "partManufacturerId" integer, "partSupplierId" integer, "partId" integer, CONSTRAINT "PK_2bb990a4015865cb1daa1d22fd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ledger_entries " ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "lot_id" integer, "operationId" integer, CONSTRAINT "PK_33ee16c111c69f3df2be7a63653" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ledger_operations" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_398509d50d06f3c6ef779ecc5d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parts" ADD CONSTRAINT "FK_d41e654b85e1986aa03ebefb99c" FOREIGN KEY ("partCategoryId") REFERENCES "part_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parts" ADD CONSTRAINT "FK_21c8d9071137b5d9eaeec3bae83" FOREIGN KEY ("vehicleModelId") REFERENCES "vehicle_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lots" ADD CONSTRAINT "FK_754fef72c787cad34ad0b3f26e7" FOREIGN KEY ("partManufacturerId") REFERENCES "part_manufacturers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lots" ADD CONSTRAINT "FK_2b5f4d10997c4c2be532ac4ca49" FOREIGN KEY ("partSupplierId") REFERENCES "part_suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lots" ADD CONSTRAINT "FK_656f5aa3730ca31858d31516f07" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ledger_entries " ADD CONSTRAINT "FK_c40210b1d7ac0343d570c945794" FOREIGN KEY ("lot_id") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ledger_entries " ADD CONSTRAINT "FK_f7635487c9371526e84d671781d" FOREIGN KEY ("operationId") REFERENCES "ledger_operations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ledger_entries " DROP CONSTRAINT "FK_f7635487c9371526e84d671781d"`);
        await queryRunner.query(`ALTER TABLE "ledger_entries " DROP CONSTRAINT "FK_c40210b1d7ac0343d570c945794"`);
        await queryRunner.query(`ALTER TABLE "lots" DROP CONSTRAINT "FK_656f5aa3730ca31858d31516f07"`);
        await queryRunner.query(`ALTER TABLE "lots" DROP CONSTRAINT "FK_2b5f4d10997c4c2be532ac4ca49"`);
        await queryRunner.query(`ALTER TABLE "lots" DROP CONSTRAINT "FK_754fef72c787cad34ad0b3f26e7"`);
        await queryRunner.query(`ALTER TABLE "parts" DROP CONSTRAINT "FK_21c8d9071137b5d9eaeec3bae83"`);
        await queryRunner.query(`ALTER TABLE "parts" DROP CONSTRAINT "FK_d41e654b85e1986aa03ebefb99c"`);
        await queryRunner.query(`DROP TABLE "ledger_operations"`);
        await queryRunner.query(`DROP TABLE "ledger_entries "`);
        await queryRunner.query(`DROP TABLE "lots"`);
        await queryRunner.query(`DROP TABLE "parts"`);
        await queryRunner.query(`DROP TABLE "vehicle_models"`);
        await queryRunner.query(`DROP TABLE "part_categories"`);
        await queryRunner.query(`DROP TABLE "part_suppliers"`);
        await queryRunner.query(`DROP TABLE "part_manufacturers"`);
    }
}
exports.SchemasNamingFix1776089481870 = SchemasNamingFix1776089481870;
//# sourceMappingURL=1776089481870-schemas-naming-fix.js.map