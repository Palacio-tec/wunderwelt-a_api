import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";

type Profile = {
  name: string;
  username: string;
  email: string;
  balance: number;
  isAdmin: boolean;
  isTeacher: boolean;
  inactivation_date?: Date;
  street_name?: string;
  street_number?: string;
  zip_code?: string;
  area_code?: string;
  phone?: string;
  document_type?: string;
  document?: string;
  credit: number;
};

@injectable()
class ShowProfileUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
  ) {}

  async execute(id: string): Promise<Profile> {
    const {
      name,
      username,
      email,
      is_admin: isAdmin,
      is_teacher: isTeacher,
      street_name,
      street_number,
      zip_code,
      area_code,
      phone,
      document_type,
      document,
      credit,
    } = await this.usersRepository.findById(id);

    return {
      name,
      username,
      email,
      balance: credit,
      isAdmin,
      isTeacher,
      street_name,
      street_number,
      zip_code,
      area_code,
      phone,
      document_type,
      document,
      credit,
    };
  }
}

export { ShowProfileUseCase };
