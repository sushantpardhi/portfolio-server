import Joi from 'joi';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

const createEnvFile = () => {
  const envExample = path.join(process.cwd(), '.env.example');
  const envFile = path.join(process.cwd(), '.env');

  if (!fs.existsSync(envFile) && fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envFile);
    console.log('Created .env file from .env.example');
  }
};

export const validateEnv = () => {
  createEnvFile();
  config();

  const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(8080),
    MONGODB_URI: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!value.startsWith('mongodb://') && !value.startsWith('mongodb+srv://')) {
          return helpers.error('Invalid MongoDB URI format');
        }
        return value;
      })
      .description('MongoDB connection string'),
    RATE_LIMIT_WINDOW_MS: Joi.number()
      .default(3600000)
      .description('Rate limiting window in milliseconds'),
    RATE_LIMIT_MAX_REQUESTS: Joi.number()
      .default(100)
      .description('Maximum number of requests within the rate limit window'),
  }).unknown();

  const { error, value: envVars } = envSchema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    throw new Error(
      `Environment validation error:\n${error.details.map((detail) => detail.message).join('\n')}`
    );
  }

  return envVars;
};
