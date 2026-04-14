import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Part } from "../part/part.entity";
import { PartManufacturer } from "../part-manufacturer/part-manufacturer.entity";
import { PartSupplier } from "../part-supplier/part-supplier.entity";

@Entity({
	name: "lots",
})
export class Lot {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ name: "part_id", type: "int" })
	partId!: number;

	@Column({ name: "initial_quantity", type: "int" })
	initialQuantity!: number;

	@Column({ name: "remaining_quantity", type: "int" })
	remainingQuantity!: number;

	@Column({ name: "unit_price", type: "float" })
	unitPrice!: number;

	@Column({ name: "created_at", type: "timestamp" })
	createdAt!: Date;

	@Column({ name: "updated_at", type: "timestamp", nullable: true })
	updatedAt!: Date | null;

	@ManyToOne(
		() => PartManufacturer,
		(partManufacturer) => partManufacturer.id,
	)
	partManufacturer!: PartManufacturer;

	@ManyToOne(
		() => PartSupplier,
		(partSupplier) => partSupplier.id,
	)
	partSupplier!: PartSupplier;

	@ManyToOne(
		() => Part,
		(part) => part.id,
	)
	part!: Part;
}
