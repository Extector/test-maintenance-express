import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Part } from "../part/part.entity";

@Entity({ name: "vehicle_models" })
export class VehicleModel {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "varchar" })
	name!: string;

	@Column({ type: "varchar" })
	description!: string;

	@OneToMany(
		() => Part,
		(part) => part.vehicleModel,
	)
	parts!: Part[];
}
