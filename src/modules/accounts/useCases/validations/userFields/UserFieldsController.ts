import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UserFieldsUseCase } from './UserFieldsUseCase';

class UserFieldsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const field = String(request.query.field);
    const value = String(request.query.value);
    const user_id = request.query.user_id;

    const userFieldsUseCase = container.resolve(UserFieldsUseCase);

    const userExists = await userFieldsUseCase.execute(field, value, user_id as string);

    return response.status(201).json(userExists);
  }
}

export { UserFieldsController };
