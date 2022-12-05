import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { AppError } from "@shared/errors/AppError";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";

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
  ) {}

  async execute({
      subject,
      description,
      user,
    }: ISendSupportMailDTO,
  ): Promise<void> {
    if (!subject) {
      throw new AppError("Subject is required");
    }

    if (!description) {
      throw new AppError("Description is required");
    }

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "support.hbs"
    );

    const tempDescription = description.split(/\r?\n/)

    let newDescription = ''

    tempDescription.forEach(info => {
      newDescription += `<br /><text>${info}</text>`
    });

    const variables = {
      description: newDescription,
      user,
    };

    this.mailProvider.sendMail({
      to: process.env.SUPPORT_MAIL,
      subject,
      variables,
      path: templatePath
    });

    return;
  }
}

export { SendSupportMailUseCase };
