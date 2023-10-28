import { compare } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  password: string;
}

@injectable()
class ProfilePasswordMatchUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository,
  ) {}

  async execute({ user_id, password }: IRequest): Promise<boolean> {
    const user = await this.userRepository.findById(user_id);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return false;
    }

    return true;
  }
}

export { ProfilePasswordMatchUseCase };
