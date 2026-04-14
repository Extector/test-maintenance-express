"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemasDataFix1776089806454 = void 0;
class SchemasDataFix1776089806454 {
    name = "SchemasDataFix1776089806454";
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lots" DROP CONSTRAINT "check_positive_quantity"`);
        await queryRunner.query(`ALTER TABLE "ledger_entries " RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "lots" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lots" ADD "updated_at" TIMESTAMP`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lots" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "lots" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "ledger_entries " RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "lots" ADD CONSTRAINT "check_positive_quantity" CHECK ((remaining_quantity >= 0))`);
    }
}
exports.SchemasDataFix1776089806454 = SchemasDataFix1776089806454;
//# sourceMappingURL=1776089806454-schemas-data-fix.js.map