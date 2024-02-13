import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateEventUseCase } from "./CreateEventUseCase";

class CreateEventController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      title,
      description,
      link,
      start_date,
      end_date,
      student_limit,
      instruction,
      credit,
      teacher_id,
      levels,
      request_subject,
      minimum_number_of_students,
      has_highlight,
      for_teachers,
      modality,
      description_formatted,
      class_subject_id
    } = request.body;
    const { id: user_id } = request.user;

    const createEventUseCase = container.resolve(CreateEventUseCase);

    const event = await createEventUseCase.execute(
      {
        title,
        description,
        link,
        start_date,
        end_date,
        student_limit,
        instruction,
        credit,
        teacher_id,
        levels,
        request_subject,
        minimum_number_of_students,
        has_highlight,
        for_teachers,
        modality,
        description_formatted,
        class_subject_id
      },
      user_id
    );

    return response.status(201).json(event);
  }
}

export { CreateEventController };
