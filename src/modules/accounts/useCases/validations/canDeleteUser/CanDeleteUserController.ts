import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CanDeleteUserUseCase } from './CanDeleteUserUseCase';

class CanDeleteUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const user_id = String(request.query.user_id);

    const canDeleteUserUseCase = container.resolve(CanDeleteUserUseCase);

    const validation = await canDeleteUserUseCase.execute(user_id);

    return response.status(201).json(validation);
  }
}

export { CanDeleteUserController };
