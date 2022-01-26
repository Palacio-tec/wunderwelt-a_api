import { ICreateHourDTO } from "@modules/accounts/dtos/ICreateHourDTO";
import { Hours } from "@modules/accounts/infra/typeorm/entities/Hours";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateHoursUseCase {
  constructor(
    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository
  ) {}

  async execute({ amount, user_id }: ICreateHourDTO): Promise<Hours> {
    const hours = await this.hoursRepository.findByUser(user_id);

    if (!hours) {
      throw new AppError("User does not has hours");
    }

    hours.amount = Number(hours.amount) + Number(amount);

    const parameterExpirationTime =
      await this.parametersRepository.findByReference("ExpirationTime");

    hours.expiration_date = this.dateProvider.addDays(
      Number(parameterExpirationTime.value)
    );

    await this.hoursRepository.update(hours);

    return hours;
  }
}

export { UpdateHoursUseCase };
