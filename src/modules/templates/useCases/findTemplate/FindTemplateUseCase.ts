import { inject, injectable } from "tsyringe";

import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";
import { Template } from "@modules/templates/infra/typeorm/entities/Template";
import { AppError } from "@shared/errors/AppError";

@injectable()
class FindTemplateUseCase {
  constructor(
    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  async execute(id: string): Promise<Template> {
    const template = await this.templatesRepository.findById(id);

    if (!template) {
      throw new AppError("Template does not exists");
    }

    return template;
  }
}

export { FindTemplateUseCase };
