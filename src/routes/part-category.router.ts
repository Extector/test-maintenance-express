import { Router } from "express";
import { PartCategory } from "../entities/part-category";
import { partCategoryRepository } from "../repositories";

export const partCategoryRouter = Router();

partCategoryRouter.get("/", async (_, res) => {
	const partCategories = await partCategoryRepository.find();
	res.json(partCategories);
});

partCategoryRouter.post("/", async (req, res) => {
	const { name } = req.body;
	const partCategory = new PartCategory();

	partCategory.name = name;

	await partCategoryRepository.save(partCategory);
	res.status(201).json(partCategory);
});
