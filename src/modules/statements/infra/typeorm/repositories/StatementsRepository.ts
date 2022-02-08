import { ICreateStatementDTO } from "@modules/statements/dtos/ICreateStatementDTO";
import { IGetBalanceDTO } from "@modules/statements/dtos/IGetBalanceDTO";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";

class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    id,
    amount,
    description,
    type,
    user_id,
    is_gift,
    payment_id,
    origin,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      id,
      amount,
      description,
      type,
      user_id,
      operation_date: new Date(),
      is_gift,
      payment_id,
      origin,
    });

    await this.repository.save(statement);

    return statement;
  }

  async findByUserId(user_id: string): Promise<Statement[]> {
    const statements = await this.repository.find({ user_id });

    return statements;
  }

  async getUserBalance({
    user_id,
    with_statement = false,
  }: IGetBalanceDTO): Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  > {
    const statement = await this.repository.find({
      where: { user_id },
      order: { "created_at": "DESC" }
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === "deposit") {
        return acc + Number(operation.amount);
      }
      return acc - Number(operation.amount);
    }, 0);

    if (with_statement) {
      return {
        statement,
        balance,
      };
    }

    return { balance };
  }
}

export { StatementsRepository };
