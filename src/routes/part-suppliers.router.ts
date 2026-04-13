import { Router } from "express";
import AppDataSource from "../database/data-source";
import { PartSupplier } from "../entities/part-supplier";

export const partSupplierRepository = AppDataSource.getRepository(PartSupplier);
export const partSuppliersRouter = Router();

partSuppliersRouter.get("/", async (_, res) => {
	const suppliers = await partSupplierRepository.find();
	res.json(suppliers);
});

partSuppliersRouter.post("/", async (req, res) => {
	const { name } = req.body;
	const supplier = new PartSupplier();
	supplier.name = name;
	await partSupplierRepository.save(supplier);
	res.status(200).send();
});
