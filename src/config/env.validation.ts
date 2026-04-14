import * as Joi from "joi";

export const envValidationSchema = Joi.object({
	NODE_ENV: Joi.string().valid("development", "production", "test"),
	PORT: Joi.number().port().default(3000),
	DATABASE_HOST: Joi.string().required(),
	DATABASE_PORT: Joi.number().required(),
	DATABASE_USERNAME: Joi.string().required(),
	DATABASE_PASSWORD: Joi.string().required(),
	DATABASE_NAME: Joi.string().required(),
	DATABASE_SCHEMA: Joi.string().default("public"),
});
