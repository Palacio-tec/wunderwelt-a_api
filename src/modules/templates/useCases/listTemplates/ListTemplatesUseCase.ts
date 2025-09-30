import { inject, injectable } from "tsyringe";

import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";
import { Template } from "@modules/templates/infra/typeorm/entities/Template";

@injectable()
class ListTemplatesUseCase {
  constructor(
    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  async execute(): Promise<Template[]> {
    const templates = await this.templatesRepository.listAllActive();

    return templates;
  }
}

export { ListTemplatesUseCase };
