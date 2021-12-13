import { ICreateHourDTO } from "@modules/accounts/dtos/ICreateHourDTO";
import { Hours } from "@modules/accounts/infra/typeorm/entities/Hours";
import { IHoursRepository } from "../IHoursRepository";

class HoursRepositoryInMemory implements IHoursRepository {
  hours: Hours[] = [];

  async create({
    amount,
    expiration_date,
    user_id,
  }: ICreateHourDTO): Promise<Hours> {
    const hour = new Hours();

    Object.assign(hour, {
      amount,
      expiration_date,
      user_id,
    });

    this.hours.push(hour);

    return hour;
  }

  async findByUser(user_id: string): Promise<Hours> {
    return this.hours.find((hour) => hour.user_id === user_id);
  }

  async update(data: ICreateHourDTO): Promise<Hours> {
    const findIndex = this.hours.findIndex((hour) => hour.id === data.id);

    this.hours[findIndex].amount = data.amount;
    this.hours[findIndex].expiration_date = data.expiration_date;

    return this.hours[findIndex];
  }
}

export { HoursRepositoryInMemory };
