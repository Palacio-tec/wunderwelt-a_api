import { inject, injectable } from "tsyringe";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { isMail } from "@utils/isMail";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

interface IRequest {
  username: string;
  password: string;
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
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
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

  async execute({ username, password }: IRequest): Promise<IResponse> {
    let user: User;

    if (isMail(username)) {
      user = await this.userRepository.findByEmail(username);
    } else {
      user = await this.userRepository.findByUsername(username);
    }

    const {
      secret_token,
      expires_in_token,
      secret_refresh_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = auth;

    if (!user) {
      throw new AppError("User or password incorrect");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("User or password incorrect");
    }

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token,
    });

    const refresh_token = sign({ username }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_in_refresh_token,
    });

    const expires_date = this.dateProvider.addDays(expires_refresh_token_days);

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date,
    });

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: user.id,
      with_statement: false,
    });

    const tokenReturn: IResponse = {
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin,
        isTeacher: user.is_teacher,
        street_name: user.street_name,
        street_number: user.street_number,
        zip_code: user.zip_code,
        area_code: user.area_code,
        phone: user.phone,
        document: user.document,
        balance,
      },
      token,
      refresh_token,
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
