import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProfilePasswordMatchUseCase } from './ProfilePasswordMatchUseCase';

class ProfilePasswordMatchController {
  async handle(request: Request, response: Response): Promise<Response> {
    const password = String(request.query.password);
    const { id: user_id } = request.user

    const profilePasswordMatchUseCase = container.resolve(ProfilePasswordMatchUseCase);

    const passwordMatch = await profilePasswordMatchUseCase.execute({ user_id, password });

    return response.json(passwordMatch);
  }
}

export { ProfilePasswordMatchController };
