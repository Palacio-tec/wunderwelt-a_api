import { getRepository, Repository } from "typeorm";

import { ICreateFQAsDTO } from "@modules/fqas/dtos/ICreateFQAsDTO";
import { IFQAsRepository } from "@modules/fqas/repositories/IFQAsRepository";

import { FQA } from "../entities/FQA";

class FQAsRepository implements IFQAsRepository {
  private repository: Repository<FQA>;

  constructor() {
    this.repository = getRepository(FQA);
  }

  async create({ id, title, description, embed_id }: ICreateFQAsDTO): Promise<FQA> {
    const fqa = this.repository.create({
        id,
        title,
        description,
        embed_id,
    });

    await this.repository.save(fqa);

    return fqa;
  }

  async findById(id: string): Promise<FQA> {
    const fqa = await this.repository.findOne(id);

    return fqa;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async list(): Promise<FQA[]> {
    const fqas = await this.repository.find();

    return fqas;
  }
}

export { FQAsRepository };
