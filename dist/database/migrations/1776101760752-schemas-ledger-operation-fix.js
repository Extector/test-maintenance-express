"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemasLedgerOperationFix1776101760752 = void 0;
class SchemasLedgerOperationFix1776101760752 {
    name = "SchemasLedgerOperationFix1776101760752";
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ledger_operations" ADD "description" character varying NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ledger_operations" DROP COLUMN "description"`);
    }
}
exports.SchemasLedgerOperationFix1776101760752 = SchemasLedgerOperationFix1776101760752;
//# sourceMappingURL=1776101760752-schemas-ledger-operation-fix.js.map