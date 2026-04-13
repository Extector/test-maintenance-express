import "reflect-metadata";
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Lot } from "./lot";
import { PartCategory } from "./part-category";
import { VehicleModel } from "./vehicle-model";

@Entity({ name: "parts" })
export class Part {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "varchar" })
	name!: string;

	@Column({ type: "varchar", default: undefined })
	description: string | undefined;

	@OneToMany(
		() => Lot,
		(lot) => lot.partId,
	)
	lots!: Lot[];

	@ManyToOne(
		() => PartCategory,
		(partCategory) => partCategory.id,
	)
	partCategory!: PartCategory;

	@ManyToOne(
		() => VehicleModel,
		(vehicleModel) => vehicleModel.id,
	)
	vehicleModel: VehicleModel | null = null;
}
