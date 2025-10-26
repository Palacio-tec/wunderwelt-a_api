interface ICreateTemplateDTO {
  version: number;
  title: string;
  subject: string;
  body: string;
  template: string;
  user_id: string;
}

interface ICreateTemplateInputDTO
  extends Pick<ICreateTemplateDTO, "title" | "subject" | "body" | "template" | "user_id"> {
}

export { ICreateTemplateDTO, ICreateTemplateInputDTO };
