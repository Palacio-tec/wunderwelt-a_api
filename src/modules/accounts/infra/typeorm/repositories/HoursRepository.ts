import { ICreateHourDTO } from "@modules/accounts/dtos/ICreateHourDTO";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { getRepository, Repository } from "typeorm";
import { Hours } from "../entities/Hours";

class HoursRepository implements IHoursRepository {
  private repository: Repository<Hours>;

  constructor() {
    this.repository = getRepository(Hours);
  }

  async create({
    amount,
    expiration_date,
    user_id,
  }: ICreateHourDTO): Promise<Hours> {
    const hours = this.repository.create({
      amount,
      expiration_date,
      user_id,
    });

    await this.repository.save(hours);

    return hours;
  }

  async findByUser(user_id: string): Promise<Hours> {
    const hours = await this.repository.findOne({ user_id });

    return hours;
  }

  async update(data: ICreateHourDTO): Promise<Hours> {
    const hours = this.repository.create(data);

    await this.repository.save(hours);

    return hours;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { HoursRepository };
