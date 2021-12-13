import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import { ListEventsByTeacherUseCase } from "./ListEventsByTeacherUseCase";

class ListEventsByTeacherController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { teacher_id, start_date, end_date } = request.query;
    const listEventsByTeacherUseCase = container.resolve(ListEventsByTeacherUseCase);

    const events = await listEventsByTeacherUseCase.execute({ teacher_id, start_date, end_date });

    return response.status(201).json(classToClass(events));
  }
}

export { ListEventsByTeacherController };
