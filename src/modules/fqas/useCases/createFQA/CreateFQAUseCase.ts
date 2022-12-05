import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IFQAsRepository } from "@modules/fqas/repositories/IFQAsRepository";
import { FQA } from "@modules/fqas/infra/typeorm/entities/FQA";
import { ICreateFQAsDTO } from "@modules/fqas/dtos/ICreateFQAsDTO";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateFQAUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("FQAsRepository")
    private fqasRepository: IFQAsRepository
  ) {}

  async execute({
    title,
    description,
    embed_id,
  }: ICreateFQAsDTO, user_id: string): Promise<FQA> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be create an event");
    }

    const fqa = await this.fqasRepository.create({
      title,
      description,
      embed_id,
    });

    return fqa;
  }
}

export { CreateFQAUseCase };
