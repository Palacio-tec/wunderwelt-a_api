import "reflect-metadata";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import "@shared/container";
import { AppError } from "@shared/errors/AppError";
import createConnection from "@shared/infra/typeorm";
import rateLimiter from "@shared/infra/http/middlewares/rateLimiter";

import { router } from "./routes";

createConnection();
const app = express();

app.use(rateLimiter);

app.use(express.json());

app.use(cors({
  exposedHeaders: ['x-total-count', 'Content-Type', 'Content-Length']
}))

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
        code: err.code,
        statusCode: err.statusCode
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };
