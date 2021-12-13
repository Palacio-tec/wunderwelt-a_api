import { Request, Response } from "express";
import { container } from "tsyringe";
import { ProfileFieldsUseCase } from "./ProfileFieldsUseCase";

class ProfileFieldsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const field = String(request.query.field);
    const value = String(request.query.value);
    const { id: user_id } = request.user

    const profileFieldsUseCase = container.resolve(ProfileFieldsUseCase);

    const userExists = await profileFieldsUseCase.execute(field, value, user_id);

    return response.status(201).json(userExists);
  }
}

export { ProfileFieldsController };
