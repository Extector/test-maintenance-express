import {
	BadRequestException,
	HttpStatus,
	INestApplication,
	NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import request = require("supertest");

import { PartController } from "./part.controller";
import { Part } from "./part.entity";
import { AddPartsSupplyUseCase } from "./usecases/add-parts-supply.usecase";
import { CreatePartUseCase } from "./usecases/create-part.usecase";
import { ListPartsUseCase } from "./usecases/list-parts.usecase";
import { RemovePartsUseCase } from "./usecases/remove-parts.usecase";
import { ReturnPartsUseCase } from "./usecases/return-parts.usecase";

describe("PartController", () => {
	let app: INestApplication;
	let listPartsUseCase: { execute: jest.Mock<Promise<Part[]>, []> };
	let createPartUseCase: {
		execute: jest.Mock<
			Promise<Part>,
			[Parameters<CreatePartUseCase["execute"]>[0]]
		>;
	};
	let addPartsSupplyUseCase: {
		execute: jest.Mock<
			Promise<void>,
			[Parameters<AddPartsSupplyUseCase["execute"]>[0]]
		>;
	};
	let removePartsUseCase: {
		execute: jest.Mock<
			Promise<{ message: string }>,
			[Parameters<RemovePartsUseCase["execute"]>[0]]
		>;
	};
	let returnPartsUseCase: {
		execute: jest.Mock<
			Promise<{ message: string }>,
			[Parameters<ReturnPartsUseCase["execute"]>[0]]
		>;
	};

	beforeEach(async () => {
		listPartsUseCase = {
			execute: jest.fn<Promise<Part[]>, []>(),
		};
		createPartUseCase = {
			execute: jest.fn<
				Promise<Part>,
				[Parameters<CreatePartUseCase["execute"]>[0]]
			>(),
		};
		addPartsSupplyUseCase = {
			execute: jest.fn<
				Promise<void>,
				[Parameters<AddPartsSupplyUseCase["execute"]>[0]]
			>(),
		};
		removePartsUseCase = {
			execute: jest.fn<
				Promise<{ message: string }>,
				[Parameters<RemovePartsUseCase["execute"]>[0]]
			>(),
		};
		returnPartsUseCase = {
			execute: jest.fn<
				Promise<{ message: string }>,
				[Parameters<ReturnPartsUseCase["execute"]>[0]]
			>(),
		};

		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [PartController],
			providers: [
				{ provide: ListPartsUseCase, useValue: listPartsUseCase },
				{ provide: CreatePartUseCase, useValue: createPartUseCase },
				{ provide: AddPartsSupplyUseCase, useValue: addPartsSupplyUseCase },
				{ provide: RemovePartsUseCase, useValue: removePartsUseCase },
				{ provide: ReturnPartsUseCase, useValue: returnPartsUseCase },
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix("api/v1");
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	describe("GET /api/v1/parts", () => {
		it("returns 200 and the list from the use case", async () => {
			const parts: Part[] = [];
			listPartsUseCase.execute.mockResolvedValue(parts);

			const res = await request(app.getHttpServer()).get("/api/v1/parts");

			expect(res.status).toBe(HttpStatus.OK);
			expect(res.body).toEqual([]);
			expect(listPartsUseCase.execute).toHaveBeenCalledTimes(1);
			expect(listPartsUseCase.execute).toHaveBeenCalledWith();
		});
	});

	describe("POST /api/v1/parts", () => {
		it("returns 201 and forwards the body to the use case", async () => {
			const created: Part = {
				id: 1,
				name: "Brake pad",
				description: "Front",
				something: 0,
				lots: [],
				partCategory: {} as Part["partCategory"],
				vehicleModel: null,
			};
			createPartUseCase.execute.mockResolvedValue(created);

			const payload = {
				name: "Brake pad",
				description: "Front",
				partCategoryId: 2,
				vehicleModelId: 3,
			};

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts")
				.send(payload);

			expect(res.status).toBe(HttpStatus.CREATED);
			expect(res.body).toMatchObject({
				id: 1,
				name: "Brake pad",
				description: "Front",
			});
			expect(createPartUseCase.execute).toHaveBeenCalledTimes(1);
			expect(createPartUseCase.execute).toHaveBeenCalledWith({
				name: payload.name,
				description: payload.description,
				partCategoryId: payload.partCategoryId,
				vehicleModelId: payload.vehicleModelId,
			});
		});

		it("passes undefined vehicleModelId when omitted", async () => {
			const created: Part = {
				id: 2,
				name: "Filter",
				description: undefined,
				something: 0,
				lots: [],
				partCategory: {} as Part["partCategory"],
				vehicleModel: null,
			};
			createPartUseCase.execute.mockResolvedValue(created);

			const payload = {
				name: "Filter",
				partCategoryId: 1,
			};

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts")
				.send(payload);

			expect(res.status).toBe(HttpStatus.CREATED);
			expect(createPartUseCase.execute).toHaveBeenCalledWith({
				name: "Filter",
				description: undefined,
				partCategoryId: 1,
				vehicleModelId: undefined,
			});
		});

		it("returns 404 when the use case throws NotFoundException", async () => {
			createPartUseCase.execute.mockRejectedValue(
				new NotFoundException({ message: "Part category not found" }),
			);

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts")
				.send({ name: "x", partCategoryId: 1 });

			expect(res.status).toBe(HttpStatus.NOT_FOUND);
			expect(createPartUseCase.execute).toHaveBeenCalled();
		});
	});

	describe("POST /api/v1/parts/add", () => {
		it("returns 200 and forwards partsSupply to the use case", async () => {
			addPartsSupplyUseCase.execute.mockResolvedValue(undefined);

			const partsSupply = [
				{
					partId: 1,
					manufacturerId: 2,
					supplierId: 3,
					quantity: 10,
					unitPrice: 4.5,
				},
			];

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts/add")
				.send({ partsSupply });

			expect(res.status).toBe(HttpStatus.OK);
			expect(res.body).toEqual({});
			expect(addPartsSupplyUseCase.execute).toHaveBeenCalledTimes(1);
			expect(addPartsSupplyUseCase.execute).toHaveBeenCalledWith({
				partsSupply,
			});
		});

		it("returns 404 when the use case throws NotFoundException", async () => {
			addPartsSupplyUseCase.execute.mockRejectedValue(
				new NotFoundException({
					message: "Entities Not Found",
					partIds: [99],
					manufacturerIds: [],
					supplierIds: [],
				}),
			);

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts/add")
				.send({
					partsSupply: [
						{
							partId: 99,
							manufacturerId: 1,
							supplierId: 1,
							quantity: 1,
							unitPrice: 1,
						},
					],
				});

			expect(res.status).toBe(HttpStatus.NOT_FOUND);
		});

		it("returns 400 when the use case throws BadRequestException", async () => {
			addPartsSupplyUseCase.execute.mockRejectedValue(
				new BadRequestException({
					message: "An error occurred in DB Transaction",
				}),
			);

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts/add")
				.send({
					partsSupply: [
						{
							partId: 1,
							manufacturerId: 1,
							supplierId: 1,
							quantity: 1,
							unitPrice: 1,
						},
					],
				});

			expect(res.status).toBe(HttpStatus.BAD_REQUEST);
		});
	});

	describe("POST /api/v1/parts/remove", () => {
		it("returns 200 and forwards description and partsRemoval", async () => {
			const result = { message: "Removed" };
			removePartsUseCase.execute.mockResolvedValue(result);

			const body = {
				description: "Work order 9",
				partsRemoval: [{ partId: 1, quantity: 2 }],
			};

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts/remove")
				.send(body);

			expect(res.status).toBe(HttpStatus.OK);
			expect(res.body).toEqual(result);
			expect(removePartsUseCase.execute).toHaveBeenCalledWith(body);
		});

		it("returns 400 when the use case throws BadRequestException", async () => {
			removePartsUseCase.execute.mockRejectedValue(
				new BadRequestException({
					message: "partsRemoval must be a non-empty array",
				}),
			);

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts/remove")
				.send({ description: "x", partsRemoval: [] });

			expect(res.status).toBe(HttpStatus.BAD_REQUEST);
		});
	});

	describe("POST /api/v1/parts/return", () => {
		it("returns 200 and forwards partsReturn to the use case", async () => {
			const result = { message: "Returned" };
			returnPartsUseCase.execute.mockResolvedValue(result);

			const partsReturn = [
				{
					partId: 1,
					referenceOperationId: 10,
					reason: "Defective",
					items: [{ lotId: 5, quantity: 1 }],
				},
			];

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts/return")
				.send({ partsReturn });

			expect(res.status).toBe(HttpStatus.OK);
			expect(res.body).toEqual(result);
			expect(returnPartsUseCase.execute).toHaveBeenCalledWith({
				partsReturn,
			});
		});

		it("returns 400 when the use case throws BadRequestException", async () => {
			returnPartsUseCase.execute.mockRejectedValue(
				new BadRequestException({
					message: "partsReturn must be a non-empty array",
				}),
			);

			const res = await request(app.getHttpServer())
				.post("/api/v1/parts/return")
				.send({ partsReturn: [] });

			expect(res.status).toBe(HttpStatus.BAD_REQUEST);
		});
	});
});
