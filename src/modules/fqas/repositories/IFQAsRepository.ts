import { ICreateFQAsDTO } from "../dtos/ICreateFQAsDTO";
import { FQA } from "../infra/typeorm/entities/FQA";

interface IFQAsRepository {
  create(data: ICreateFQAsDTO): Promise<FQA>;
  findById(id: string): Promise<FQA>;
  delete(id: string): Promise<void>;
  list(): Promise<FQA[]>;
}

export { IFQAsRepository };
