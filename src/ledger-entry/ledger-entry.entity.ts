import "reflect-metadata";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { LedgerOperation } from "../ledger-operation/ledger-operation.entity";
import { Lot } from "../lot/lot.entity";

@Entity({ name: "ledger_entries " })
export class LedgerEntry {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ name: "quantity", type: "int" })
	quantity!: number;

	@Column({ type: "varchar" })
	type!: "credit" | "debit";

	@Column({ name: "created_at", type: "timestamp" })
	createdAt!: Date;

	@ManyToOne(
		() => Lot,
		(lot) => lot.id,
	)
	@JoinColumn({ name: "lot_id" })
	lot!: Lot;

	@ManyToOne(
		() => LedgerOperation,
		(ledgerOperation) => ledgerOperation.id,
	)
	operation!: LedgerOperation;
}
