import { inject, injectable } from "tsyringe";
import { compare, hash } from "bcryptjs";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IUpdateProfileDTO } from "@modules/accounts/dtos/IUpdateProfileDTO";

@injectable()
class UpdateProfileUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({
    id,
    name,
    username,
    email,
    old_password,
    password,
    street_name,
    street_number,
    zip_code,
    area_code,
    phone,
    document_type,
    document,
    receive_email,
    receive_newsletter,
  }: IUpdateProfileDTO): Promise<void> {
    const userUsernameAlreadyExists = await this.usersRepository.findByFieldForOtherUser(
      'username',
      username,
      id
    );

    const userUsermaillreadyExists = await this.usersRepository.findByFieldForOtherUser(
      'email',
      email,
      id
    );

    if (userUsernameAlreadyExists.length > 0 || userUsermaillreadyExists.length > 0) {
      throw new AppError("User username or mail already exists");
    }

    if (password && !old_password) {
      throw new AppError(
        'You need to inform old password to set a new password.',
      );
    }

    const user = await this.usersRepository.findById(id);

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.username = username;
    user.email = email;
    user.street_name = street_name;
    user.street_number = street_number;
    user.zip_code = zip_code;
    user.area_code = area_code;
    user.phone = phone;
    user.document_type = document_type;
    user.document = document;
    user.receive_email = receive_email;
    user.receive_newsletter = receive_newsletter;

    await this.usersRepository.create(user);
  }
}

export { UpdateProfileUseCase };
