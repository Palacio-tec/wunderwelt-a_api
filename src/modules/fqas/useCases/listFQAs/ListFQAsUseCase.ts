import { inject, injectable } from "tsyringe";

import { IFQAsRepository } from "@modules/fqas/repositories/IFQAsRepository";
import { FQA } from "@modules/fqas/infra/typeorm/entities/FQA";

@injectable()
class ListFQAsUseCase {
  constructor(
    @inject("FQAsRepository")
    private fqasRepository: IFQAsRepository
  ) {}

  async execute(): Promise<FQA[]> {
    const fqas = await this.fqasRepository.list();

    return fqas;
  }
}

export { ListFQAsUseCase };
