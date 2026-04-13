import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Part } from "./part";

@Entity({ name: "part_categories" })
export class PartCategory {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "varchar" })
	name!: string;

	@Column({ type: "varchar", nullable: true })
	description!: string | null;

	@OneToMany(
		() => Part,
		(part) => part.partCategory,
	)
	parts!: Part[];
}
