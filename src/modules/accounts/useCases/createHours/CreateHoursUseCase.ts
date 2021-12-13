import { ICreateHourDTO } from "@modules/accounts/dtos/ICreateHourDTO";
import { Hours } from "@modules/accounts/infra/typeorm/entities/Hours";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { AppError } from "@shared/errors/AppError";
import { usersRoutes } from "@shared/infra/http/routes/users.routes";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateHoursUseCase {
  constructor(
    @inject("HoursRepository")
    private hoursRepository: IHoursRepository
  ) {}

  async execute({
    amount,
    expiration_date,
    user_id,
  }: ICreateHourDTO): Promise<Hours> {
    const hoursExist = await this.hoursRepository.findByUser(user_id);

    if (hoursExist) {
      throw new AppError("User already has hours registered");
    }

    const hours = await this.hoursRepository.create({
      amount,
      expiration_date,
      user_id,
    });

    return hours;
  }
}

export { CreateHoursUseCase };
