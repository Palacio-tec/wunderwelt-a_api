import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

type Profile = {
  name: string;
  username: string;
  email: string;
  is_admin: boolean;
  is_teacher: boolean;
  inactivation_date: Date;
  street_name: string;
  street_number: string;
  zip_code: string;
  area_code: string;
  phone: string;
  document_type: string;
  document: string;
  receive_email: boolean;
  receive_newsletter: boolean;
  is_company: boolean;
  birth_date: Date;
  level_id: string | null;
  level: string | null;
  our_student?: boolean;
};

@injectable()
class FindUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<Profile> {
    const {
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
      level,
      our_student,
    } = await this.usersRepository.findById(id);

    return {
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
      level_id: level?.id || null,
      level: level?.name || null,
      our_student,
    };
  }
}

export { FindUserUseCase };
