import { User } from "@modules/accounts/infra/typeorm/entities/User";

interface ICreateTemplateDTO {
  version: number;
  title: string;
  body: string;
  template: string;
  user_id: string;
}

interface ICreateTemplateInputDTO
  extends Pick<ICreateTemplateDTO, "title" | "body" | "template"> {
  user_id: string;
}

export { ICreateTemplateDTO, ICreateTemplateInputDTO };
