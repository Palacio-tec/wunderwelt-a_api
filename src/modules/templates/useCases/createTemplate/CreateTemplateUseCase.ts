import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateTemplateInputDTO } from "@modules/templates/dtos/ICreateTemplateDTO";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateTemplateUseCase {
  constructor(
    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    title,
    body,
    template,
    user_id,
  }: ICreateTemplateInputDTO): Promise<{
    id: string;
  }> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists.");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be update an event");
    }

    const latestTemplate = await this.templatesRepository.findLatestByTemplate(
      template
    );
    const version = latestTemplate ? latestTemplate.version + 1 : 1;

    await this.templatesRepository.disableLatestVersionByTemplate(template);

    const templateEntity = await this.templatesRepository.create({
      title,
      body,
      template,
      version,
      created_by: userExists,
    });

    return { id: templateEntity.id };
  }
}

export { CreateTemplateUseCase };
