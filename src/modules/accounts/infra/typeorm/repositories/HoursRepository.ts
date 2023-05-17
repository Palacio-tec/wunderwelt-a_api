import { ICreateHourDTO } from "@modules/accounts/dtos/ICreateHourDTO";
import { IFindWillExpiredHoursDTO } from "@modules/accounts/dtos/IFindWillExpiredHoursDTO";
import { IListAllBalanceDTO } from "@modules/accounts/dtos/IListAllBalanceDTO";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { getRepository, MoreThan, Repository } from "typeorm";
import { Hours } from "../entities/Hours";

class HoursRepository implements IHoursRepository {
  private repository: Repository<Hours>;

  constructor() {
    this.repository = getRepository(Hours);
  }

  async create({
    id,
    amount,
    expiration_date,
    user_id,
    balance,
    purchase_id,
  }: ICreateHourDTO): Promise<Hours> {
    const hours = this.repository.create({
      id,
      amount,
      expiration_date,
      user_id,
      balance,
      purchase_id,
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

  async findByPurchaseIdAndUser(purchase_id: string, user_id: string): Promise<Hours> {
    const hour = await this.repository.findOne({
      user_id, purchase_id
    })

    return hour
  }

  async listAvailableByUser(user_id: string): Promise<Hours[]> {
    const hours = await this.repository.find({
      where: {
        user_id,
        amount: MoreThan(0),
        expiration_date: MoreThan(new Date())
      },
      order: {
        expiration_date: "ASC"
      }
    })

    return hours
  }

  async findById(id: string): Promise<Hours> {
    const hours = await this.repository.findOne({ id })

    return hours
  }

  async findWillExpired(startDate: string, endDate: string): Promise<IFindWillExpiredHoursDTO[]> {
    const hours = await this.repository.query(`
      SELECT
        h.user_id, u."name", u.email, sum(h.balance) AS amount from hours h
      INNER JOIN
        users u 
      ON
        u.id = h.user_id AND u.inactivation_date IS NULL
      WHERE
        to_char(h.expiration_date, 'YYYY-MM-DD') BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY
        h.user_id,
        u."name",
        u.email
    `)

    return hours
  }

  async listAllBalance(): Promise<IListAllBalanceDTO[]> {
    const listBalance = await this.repository.query(`
      select
        u.id as user_id, u.credit,
        sum(
          case
            when h.balance is null then 0
            else h.balance
          end
        ) as amount
      from
        users u
      left join
        hours h
      on
        h.user_id = u.id
        and to_char(expiration_date, 'YYYY-MM-DD') >= '${new Intl
          .DateTimeFormat('fr-CA', {
            year: "numeric", month: "2-digit", day: "2-digit",
            timeZone: 'America/Sao_Paulo'
          }).format(new Date())}'
      group by
        u.id
    `)

    return listBalance
  }
}

export { HoursRepository };
