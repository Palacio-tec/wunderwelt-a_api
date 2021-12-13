import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateEventUseCase } from "./UpdateEventUseCase";

class UpdateEventControllet {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      title,
      description,
      link,
      start_date,
      end_date,
      student_limit,
      instruction,
      teacher_id,
      credit,
      request_subject,
      levels,
    } = request.body;
    const { id } = request.params;
    const { id: user_id } = request.user;

    const updateEventUseCase = container.resolve(UpdateEventUseCase);

    const event = await updateEventUseCase.execute(
      {
        id,
        title,
        description,
        link,
        start_date,
        end_date,
        student_limit,
        instruction,
        teacher_id,
        credit,
        request_subject,
        levels,
      },
      user_id
    );

    return response.status(201).send(event);
  }
}

export { UpdateEventControllet };
