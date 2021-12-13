import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListTeachersUseCase } from "./ListTeachersUseCase";

class ListTeachersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listTeachersUseCase = container.resolve(ListTeachersUseCase);

    const teachers = await listTeachersUseCase.execute();

    return response.status(201).json(classToClass(teachers));
  }
}

export { ListTeachersController };
