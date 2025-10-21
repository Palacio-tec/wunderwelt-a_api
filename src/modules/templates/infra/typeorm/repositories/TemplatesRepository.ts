import { getRepository, Repository, In } from "typeorm";

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
      order: { title: "ASC" },
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
      await this.repository.update({ id: latestTemplate.id }, { is_active: false });
    }
  }

  async findTemplateAndBase(template: string, base?: string): Promise<Map<string, Template>> {
    const baseTemplate = base || "base";
    const latestTemplate = await this.repository.findOne({
      where: {
        template: template,
        is_active: true,
      },
    });
    const latestBaseTemplate = await this.repository.findOne({
      where: {
        template: baseTemplate,
      },
    });

    const templatesMap = new Map<string, Template>();
    templatesMap.set(latestTemplate.template, latestTemplate);
    templatesMap.set(latestBaseTemplate.template, latestBaseTemplate);

    return templatesMap;
  }
}

export { TemplatesRepository };
