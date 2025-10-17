import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";
import { AppError } from "@shared/errors/AppError";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";

@injectable()
class TestTemplateUseCase {
  constructor(
    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,
  ) {}

  async execute({
    templateName,
    base,
    variables,
    user_id
  }: { templateName: string, base: string, variables: Record<string, any>, user_id: string }): Promise<void> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists.");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be update an event");
    }

    if (!base) {
      base = "base";
    }

    const templates = await this.templatesRepository.findTemplateAndBase(
      templateName,
      base
    );

    await this.mailProvider.sendMail({
      to: userExists.email,
      subject: "Este email é um teste",
      variables,
      template: templates.get(templateName).body,
      base: templates.get(base).body,
    });
  }
}

export { TestTemplateUseCase };
