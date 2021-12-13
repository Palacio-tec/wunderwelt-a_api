import { ICreateStatementDTO } from "../dtos/ICreateStatementDTO";
import { IGetBalanceDTO } from "../dtos/IGetBalanceDTO";
import { Statement } from "../infra/typeorm/entities/Statement";

interface IStatementsRepository {
  create(data: ICreateStatementDTO): Promise<Statement>;
  findByUserId(user_id: string): Promise<Statement[]>;
  getUserBalance(
    data: IGetBalanceDTO
  ): Promise<{ balance: number } | { balance: number; statement: Statement[] }>;
}

export { IStatementsRepository };
