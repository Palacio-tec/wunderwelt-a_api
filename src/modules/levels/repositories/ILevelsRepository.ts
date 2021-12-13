import { ICreateLevelsDTO } from "../dtos/ICreateLevelsDTO";
import { Level } from "../infra/typeorm/entities/Level";

interface ILevelsRepository {
  create(data: ICreateLevelsDTO): Promise<Level>;
  findByName(name: string): Promise<Level>;
  findById(id: string): Promise<Level>;
  delete(id: string): Promise<void>;
  list(): Promise<Level[]>;
  findByFieldForOtherLevel(field: string, value: string, user_id: string): Promise<Level[]>;
  findByField(field: string, value: string): Promise<Level[]>;
}

export { ILevelsRepository };
