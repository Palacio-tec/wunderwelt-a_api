import { ICreateHourDTO } from "../dtos/ICreateHourDTO";
import { Hours } from "../infra/typeorm/entities/Hours";

interface IHoursRepository {
  create({ amount, expiration_date, user_id }: ICreateHourDTO): Promise<Hours>;
  findByUser(user_id: string): Promise<Hours>;
  update(data: ICreateHourDTO): Promise<Hours>;
  delete(id: string): Promise<void>;
}

export { IHoursRepository };
