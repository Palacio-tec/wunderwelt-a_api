import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateProfileUseCase } from "./UpdateProfileUseCase";

class UpdateProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      username,
      email,
      old_password,
      password,
      street_name,
      street_number,
      zip_code,
      area_code,
      phone,
      document_type,
      document,
      receive_email,
      receive_newsletter,
      birth_date,
      level_id,
    } = request.body;
    const { id } = request.user;

    const updateProfileUseCase = container.resolve(
      UpdateProfileUseCase
    );

    await updateProfileUseCase.execute({
      id,
      name,
      username,
      email,
      old_password,
      password,
      street_name,
      street_number,
      zip_code,
      area_code,
      phone,
      document_type,
      document,
      receive_email,
      receive_newsletter,
      birth_date,
      level_id,
    });

    return response.status(201).send();
  }
}

export { UpdateProfileController };
