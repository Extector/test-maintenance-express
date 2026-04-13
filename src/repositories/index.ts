import AppDataSource from "../database/data-source";
import {
	LedgerEntry,
	LedgerOperation,
	Lot,
	Part,
	PartCategory,
	PartManufacturer,
	PartSupplier,
	VehicleModel,
} from "../entities";

export const partRepository = AppDataSource.getRepository(Part);
export const lotRepository = AppDataSource.getRepository(Lot);
export const ledgerEntryRepository = AppDataSource.getRepository(LedgerEntry);
export const partSupplierRepository = AppDataSource.getRepository(PartSupplier);
export const vehicleModelRepository = AppDataSource.getRepository(VehicleModel);
export const partCategoryRepository = AppDataSource.getRepository(PartCategory);
export const ledgerOperationRepository =
	AppDataSource.getRepository(LedgerOperation);
export const partManufacturerRepository =
	AppDataSource.getRepository(PartManufacturer);
