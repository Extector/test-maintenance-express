"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerOperationParent1776102000000 = void 0;
class LedgerOperationParent1776102000000 {
    name = "LedgerOperationParent1776102000000";
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ledger_operations" ADD "parentOperationId" integer`);
        await queryRunner.query(`ALTER TABLE "ledger_operations" ADD CONSTRAINT "FK_ledger_operations_parent" FOREIGN KEY ("parentOperationId") REFERENCES "ledger_operations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ledger_operations" DROP CONSTRAINT "FK_ledger_operations_parent"`);
        await queryRunner.query(`ALTER TABLE "ledger_operations" DROP COLUMN "parentOperationId"`);
    }
}
exports.LedgerOperationParent1776102000000 = LedgerOperationParent1776102000000;
//# sourceMappingURL=1776102000000-ledger-operation-parent.js.map