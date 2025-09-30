import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateTemplateInputDTO } from "@modules/templates/dtos/ICreateTemplateDTO";
import { Template } from "@modules/templates/infra/typeorm/entities/Template";
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
  }: ICreateTemplateInputDTO): Promise<Template> {
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

    const templateEntity = await this.templatesRepository.create({
      title,
      body,
      template,
      version,
      created_by: userExists,
    });

    await this.templatesRepository.disableLatestVersionByTemplate(template);

    return templateEntity;
  }
}

export { CreateTemplateUseCase };
