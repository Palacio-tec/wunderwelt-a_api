import { getRepository, Repository } from "typeorm";

import { ICreateLevelsDTO } from "@modules/levels/dtos/ICreateLevelsDTO";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";

import { Level } from "../entities/Level";

class LevelsRepository implements ILevelsRepository {
  private repository: Repository<Level>;

  constructor() {
    this.repository = getRepository(Level);
  }

  async create({ id, name, color, variant }: ICreateLevelsDTO): Promise<Level> {
    const level = this.repository.create({
      id,
      name,
      color,
      variant,
    });

    await this.repository.save(level);

    return level;
  }

  async findByName(name: string): Promise<Level> {
    const level = await this.repository.findOne({ name });

    return level;
  }

  async findById(id: string): Promise<Level> {
    const level = await this.repository.findOne(id);

    return level;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async list(): Promise<Level[]> {
    const levels = this.repository.find({ order: { name: "ASC" } });

    return levels;
  }

  async findByFieldForOtherLevel(field: string, value: string, level_id: string): Promise<Level[]> {
    const levels = await this.repository.query(
      `SELECT 
        l.id
      FROM
        levels l
      WHERE
        l.id <> '${level_id}'
        AND l.${field} = '${value}'`
    );

    return levels;
  }

  async findByField(field: string, value: string): Promise<Level[]> {
    const levels = await this.repository.query(
      `SELECT 
        l.id
      FROM
        levels l
      WHERE
        l.${field} = '${value}'`
    );

    return levels;
  }
}

export { LevelsRepository };
