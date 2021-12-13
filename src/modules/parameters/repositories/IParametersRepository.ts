import { ICreateParameterDTO } from "../dtos/ICreateParameterDTO";
import { Parameter } from "../infra/typeorm/entities/Parameter";

interface IParametersRepository {
  create(date: ICreateParameterDTO): Promise<Parameter>;
  findById(id: string): Promise<Parameter>;
  findByReference(reference: string): Promise<Parameter>;
  list(): Promise<Parameter[]>;
}

export { IParametersRepository };
