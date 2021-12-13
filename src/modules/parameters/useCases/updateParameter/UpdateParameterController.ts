import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateParameterUseCase } from "./UpdateParameterUseCase";

class UpdateParameterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { value } = request.body;
    const { id } = request.params;

    const updateParameterUseCase = container.resolve(UpdateParameterUseCase);

    const parameter = await updateParameterUseCase.execute({
      id,
      value,
    });

    return response.status(201).json(parameter);
  }
}

export { UpdateParameterController };
