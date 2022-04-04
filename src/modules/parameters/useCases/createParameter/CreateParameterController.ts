import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateParameterUseCase } from "./CreateParameterUseCase";

class CreateParameterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      description,
      reference,
      value
    } = request.body;
    const { id: user_id } = request.user;

    const createParameterUseCase = container.resolve(CreateParameterUseCase);

    const parameter = await createParameterUseCase.execute(
      {
        description,
        reference,
        value,
      },
      user_id
    );

    return response.status(201).json(parameter);
  }
}

export { CreateParameterController };
