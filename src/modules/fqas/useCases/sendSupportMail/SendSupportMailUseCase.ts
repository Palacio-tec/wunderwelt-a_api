import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { AppError } from "@shared/errors/AppError";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

interface ISendSupportMailDTO {
  subject: string;
  description: string;
  user: {
    name: string;
    email: string;
  };
}

@injectable()
class SendSupportMailUseCase {
  constructor(
    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  async execute({
    subject,
    description,
    user,
  }: ISendSupportMailDTO): Promise<void> {
    if (!subject) {
      throw new AppError("Subject is required");
    }

    if (!description) {
      throw new AppError("Description is required");
    }

    const template = await this.templatesRepository.findLatestByTemplate(
      "support"
    );

    const tempDescription = description.split(/\r?\n/);

    let newDescription = "";

    tempDescription.forEach((info) => {
      newDescription += `<br /><text>${info}</text>`;
    });

    const variables = {
      description: newDescription,
      user,
    };

    this.mailProvider.sendMail({
      to: process.env.SUPPORT_MAIL,
      subject,
      variables,
      template: template.body,
    });

    return;
  }
}

export { SendSupportMailUseCase };
