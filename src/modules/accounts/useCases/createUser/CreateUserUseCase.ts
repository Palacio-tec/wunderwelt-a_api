import { inject, injectable } from "tsyringe";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  async execute({
    name,
    username,
    password,
    email,
    is_admin,
    is_teacher,
    street_name,
    street_number,
    zip_code,
    area_code,
    phone,
    document_type,
    document,
    receive_email,
    receive_newsletter,
    is_company,
    birth_date,
    level_id,
    our_student,
  }: ICreateUserDTO): Promise<User> {
    username = username.toLocaleLowerCase().trim();
    email = email.toLocaleLowerCase().trim();

    const userUsernameAlreadyExists = await this.usersRepository.findByUsername(
      username
    );

    const userUsermaillreadyExists = await this.usersRepository.findByEmail(
      email
    );

    if (userUsernameAlreadyExists || userUsermaillreadyExists) {
      throw new AppError("User username or mail already exists");
    }

    let sendPasswordEmail = false;

    if (!password) {
      password = randomBytes(8).toString("hex");

      sendPasswordEmail = true;
    }

    const passwordHash = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      username,
      password: passwordHash,
      email,
      is_admin,
      is_teacher,
      street_name,
      street_number,
      zip_code,
      area_code,
      phone,
      document_type,
      document,
      receive_email,
      receive_newsletter,
      is_company,
      birth_date,
      level_id,
      our_student,
    });

    const expiration_date = this.dateProvider.dateNow();

    await this.hoursRepository.create({
      amount: 0,
      expiration_date,
      user_id: user.id,
      balance: 0,
    });

    if (sendPasswordEmail) {
      const templates = await this.templatesRepository.findTemplateAndBase(
        "create_user"
      );

      const variables = {
        name,
        username,
        password,
      };

      this.mailProvider.sendMail({
        to: email,
        subject: templates.get("create_user").subject,
        variables,
        template: templates.get("create_user").body,
        base: templates.get("base").body,
      });
    }

    return user;
  }
}

export { CreateUserUseCase };
