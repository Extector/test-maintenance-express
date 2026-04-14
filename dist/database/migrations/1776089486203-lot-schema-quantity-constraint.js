"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotSchemaQuantityConstraint1776089486203 = void 0;
class LotSchemaQuantityConstraint1776089486203 {
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE lots ADD CONSTRAINT check_positive_quantity CHECK (remaining_quantity >= 0)");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE lots DROP CONSTRAINT IF EXISTS check_positive_quantity ");
    }
}
exports.LotSchemaQuantityConstraint1776089486203 = LotSchemaQuantityConstraint1776089486203;
//# sourceMappingURL=1776089486203-lot-schema-quantity-constraint.js.map