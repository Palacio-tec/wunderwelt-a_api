import { inject, injectable } from "tsyringe";

import { ICreateHourDTO } from "@modules/accounts/dtos/ICreateHourDTO";
import { Hours } from "@modules/accounts/infra/typeorm/entities/Hours";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

@injectable()
class CreateHoursUseCase {
  constructor(
    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    amount,
    user_id,
    balance,
  }: ICreateHourDTO): Promise<Hours> {
    const userExist = await this.usersRepository.findById(user_id);

    if (!userExist) {
      throw new AppError("User does not exists");
    }

    const expirationTimeParameter = await this.parametersRepository.findByReference('ExpirationTime');
    const validityDays = Number(expirationTimeParameter.value)

    const expiration_date = this.dateProvider.addDays(validityDays);

    const hours = await this.hoursRepository.create({
      amount,
      expiration_date,
      user_id,
      balance
    });

    await this.usersRepository.create({
      ...userExist,
      credit: (userExist.credit + amount)
    })

    return hours;
  }
}

export { CreateHoursUseCase };
