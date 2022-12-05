import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateFQAUseCase } from "./CreateFQAUseCase";

class CreateFQAController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { title, description, embed_id } = request.body;
    const user_id = request.user.id;

    const createFQAUseCase = container.resolve(CreateFQAUseCase);

    const fqa = await createFQAUseCase.execute({
      title, description, embed_id
    }, user_id);

    return response.status(201).json(fqa);
  }
}

export { CreateFQAController };
