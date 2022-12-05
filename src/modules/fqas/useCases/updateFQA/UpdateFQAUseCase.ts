import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IFQAsRepository } from "@modules/fqas/repositories/IFQAsRepository";
import { ICreateFQAsDTO } from "@modules/fqas/dtos/ICreateFQAsDTO";
import { FQA } from "@modules/fqas/infra/typeorm/entities/FQA";
import { AppError } from "@shared/errors/AppError";

@injectable()
class UpdateFQAUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("FQAsRepository")
    private fqasRepository: IFQAsRepository
  ) {}

  async execute({
      id,
      title,
      description,
      embed_id,
    }: ICreateFQAsDTO,
    user_id: string
  ): Promise<FQA> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be update an event");
    }

    const fqaIdExists = await this.fqasRepository.findById(id);

    if (!fqaIdExists) {
      throw new AppError("FQA does not exists");
    }

    const fqa = this.fqasRepository.create({
      id,
      title,
      description,
      embed_id,
    });

    return fqa;
  }
}

export { UpdateFQAUseCase };
