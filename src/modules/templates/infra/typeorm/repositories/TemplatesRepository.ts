import { getRepository, Repository } from "typeorm";

import { ICreateTemplateDTO } from "@modules/templates/dtos/ICreateTemplateDTO";

import { Template } from "../entities/Template";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

class TemplatesRepository implements ITemplatesRepository {
  private repository: Repository<Template>;

  constructor() {
    this.repository = getRepository(Template);
  }

  async create(data: ICreateTemplateDTO): Promise<Template> {
    const template = this.repository.create(data);

    await this.repository.save(template);

    return template;
  }

  async findById(id: string): Promise<Template> {
    const template = await this.repository.findOne({
      where: { id },
    });

    return template;
  }

  async listAllActive(): Promise<Template[]> {
    const templates = await this.repository.find({
      where: { is_active: true },
    });

    return templates;
  }

  async findLatestByTemplate(template: string): Promise<Template> {
    const latestTemplate = await this.repository.findOne({
      where: {
        template,
        is_active: true,
      },
    });

    return latestTemplate;
  }

  async disableLatestVersionByTemplate(template: string): Promise<void> {
    const latestTemplate = await this.findLatestByTemplate(template);
    if (latestTemplate) {
      latestTemplate.is_active = false;
      await this.repository.update({ id: latestTemplate.id }, latestTemplate);
    }
  }
}

export { TemplatesRepository };
