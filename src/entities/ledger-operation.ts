import "reflect-metadata";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { LedgerEntry } from "./ledger-entry";

@Entity({ name: "ledger_operations" })
export class LedgerOperation {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "varchar" })
	type!: "entry" | "exit" | "return" | "return_to_supplier";

	@Column({ type: "varchar" })
	description!: string;

	@Column({ type: "timestamp" })
	createdAt!: Date;

	@ManyToOne(() => LedgerOperation, { nullable: true })
	@JoinColumn({ name: "parentOperationId" })
	parentOperation!: LedgerOperation | null;

	@OneToMany(
		() => LedgerEntry,
		(ledger) => ledger.operation,
	)
	ledgerEntry!: LedgerEntry;
}
