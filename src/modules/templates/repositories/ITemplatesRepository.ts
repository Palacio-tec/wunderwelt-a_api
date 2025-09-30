import { ICreateTemplateDTO } from "../dtos/ICreateTemplateDTO";
import { Template } from "../infra/typeorm/entities/Template";

interface ITemplatesRepository {
  create(data: ICreateTemplateDTO): Promise<Template>;
  findById(id: string): Promise<Template>;
  listAllActive(): Promise<Template[]>;
  findLatestByTemplate(template: string): Promise<Template>;
  disableLatestVersionByTemplate(template: string): Promise<void>;
}

export { ITemplatesRepository };
