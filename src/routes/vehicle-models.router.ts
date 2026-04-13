import { Router } from "express";
import { VehicleModel } from "../entities/vehicle-model";
import { vehicleModelRepository } from "../repositories";

export const vehicleModelsRouter = Router();

vehicleModelsRouter.get("/", async (_, res) => {
	const vehicleModels = await vehicleModelRepository.find();
	res.json(vehicleModels);
});

vehicleModelsRouter.post("/", async (req, res) => {
	const { name } = req.body;
	const vehicleModel = new VehicleModel();
	vehicleModel.name = name;

	await vehicleModelRepository.save(vehicleModel);
	res.status(201).json(vehicleModel);
});
