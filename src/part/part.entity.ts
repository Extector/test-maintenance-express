import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Lot } from "../lot/lot.entity";
import { PartCategory } from "../part-category/part-category.entity";
import { VehicleModel } from "../vehicle-model/vehicle-model.entity";

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
