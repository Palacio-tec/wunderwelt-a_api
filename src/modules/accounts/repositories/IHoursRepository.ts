import { ICreateHourDTO } from "../dtos/ICreateHourDTO";
import { IFindWillExpiredHoursDTO } from "../dtos/IFindWillExpiredHoursDTO";
import { IListAllBalanceDTO } from "../dtos/IListAllBalanceDTO";
import { Hours } from "../infra/typeorm/entities/Hours";

interface IHoursRepository {
  create({ amount, expiration_date, user_id }: ICreateHourDTO): Promise<Hours>;
  findByUser(user_id: string): Promise<Hours>;
  update(data: ICreateHourDTO): Promise<Hours>;
  delete(id: string): Promise<void>;
  findByPurchaseIdAndUser(purchase_id: string, user_id: string): Promise<Hours>;
  listAvailableByUser(user_id: string): Promise<Hours[]>;
  findById(id: string): Promise<Hours>;
  findWillExpired(startDate: string, endDate: string): Promise<IFindWillExpiredHoursDTO[]>
  listAllBalance(): Promise<IListAllBalanceDTO[]>
}

export { IHoursRepository };
