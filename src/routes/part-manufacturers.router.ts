import { Router } from "express";
import { PartManufacturer } from "../entities/part-manufacturer";
import { partManufacturerRepository } from "../repositories";

export const manufacturersRouter = Router();

manufacturersRouter.get("/", async (_, res) => {
	const manufacturers = await partManufacturerRepository.find();
	res.json(manufacturers);
});

manufacturersRouter.post("/", async (req, res) => {
	const { name } = req.body;
	const manufacturer = new PartManufacturer();

	manufacturer.name = name;
	await partManufacturerRepository.save(manufacturer);
	res.json(manufacturer);
});
