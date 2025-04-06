import { inject, injectable } from "tsyringe";
import { compare, hash } from "bcryptjs";

import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    id,
    name,
    username,
    email,
    is_admin,
    is_teacher,
    inactivation_date,
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
  }: IUpdateUserDTO): Promise<User> {
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

    const user = await this.usersRepository.findById(id);

    user.name = name;
    user.username = username;
    user.email = email;
    user.is_admin = is_company ? false : is_admin;
    user.is_teacher = is_company ? false : is_teacher;
    user.street_name = street_name;
    user.street_number = street_number;
    user.zip_code = zip_code;
    user.area_code = area_code;
    user.phone = phone;
    user.document_type = document_type;
    user.document = document;
    user.receive_email = receive_email;
    user.receive_newsletter = receive_newsletter;
    user.is_company = is_company;
    user.birth_date = birth_date;
    if (inactivation_date) {
      user.inactivation_date = inactivation_date;
    }
    user.level_id = level_id;

    await this.usersRepository.create(user);

    return user
  }
}

export { UpdateUserUseCase };
