import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Lot } from "../lot/lot.entity";

@Entity({
	name: "part_suppliers",
})
export class PartSupplier {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "varchar" })
	name!: string;

	@Column({ type: "varchar", default: undefined })
	description: string | undefined;

	@OneToMany(
		() => Lot,
		(lot) => lot.partSupplier,
	)
	lots!: Lot[];
}
