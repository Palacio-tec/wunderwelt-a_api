import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";

interface IRequest {
  user_id: string;
  admin_user: string;
}

interface IResponse {
  user: {
    name: string;
    username: string;
    email: string;
    isAdmin: boolean;
    isTeacher: boolean;
    balance: number;
    street_name: string;
    street_number: string;
    zip_code: string;
    area_code: string;
    phone: string;
    document: string;
    credit: number;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class ImpersonateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
  ) {}

  async execute({ admin_user, user_id }: IRequest): Promise<IResponse> {
    const adminUser = await this.userRepository.findById(admin_user);

    if (!adminUser) {
      throw new AppError('User does not exists')
    }

    if (!adminUser.is_admin) {
      throw new AppError('User is not an admin')
    }

    const impersonateUser = await this.userRepository.findById(user_id);

    if (!impersonateUser) {
      throw new AppError('User does not exists')
    }

    const {
      secret_token,
      expires_in_token,
      secret_refresh_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = auth;

    const token = sign({}, secret_token, {
      subject: user_id,
      expiresIn: expires_in_token,
    });

    const refresh_token = sign({ username: impersonateUser.username }, secret_refresh_token, {
      subject: user_id,
      expiresIn: expires_in_refresh_token,
    });

    const expires_date = this.dateProvider.addDays(expires_refresh_token_days);

    await this.usersTokensRepository.create({
      user_id: user_id,
      refresh_token,
      expires_date,
    });
    const tokenReturn: IResponse = {
      user: {
        name: impersonateUser.name,
        username: impersonateUser.username,
        email: impersonateUser.email,
        isAdmin: impersonateUser.is_admin,
        isTeacher: impersonateUser.is_teacher,
        street_name: impersonateUser.street_name,
        street_number: impersonateUser.street_number,
        zip_code: impersonateUser.zip_code,
        area_code: impersonateUser.area_code,
        phone: impersonateUser.phone,
        document: impersonateUser.document,
        balance: impersonateUser.credit,
        credit: impersonateUser.credit,
      },
      token,
      refresh_token,
    };

    return tokenReturn;
  }
}

export { ImpersonateUserUseCase };
