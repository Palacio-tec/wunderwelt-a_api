import { inject, injectable } from "tsyringe";

import { IFQAsRepository } from "@modules/fqas/repositories/IFQAsRepository";
import { FQA } from "@modules/fqas/infra/typeorm/entities/FQA";

@injectable()
class FindFQAUseCase {
  constructor(
    @inject("FQAsRepository")
    private fqasRepository: IFQAsRepository,
  ) {}

  async execute(id: string): Promise<FQA> {
    const {
      title,
      description,
      embed_id,
    } = await this.fqasRepository.findById(id);

    return {
      id,
      title,
      description,
      embed_id,
    };
  }
}

export { FindFQAUseCase };
