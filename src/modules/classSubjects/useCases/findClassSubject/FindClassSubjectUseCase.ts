import { inject, injectable } from "tsyringe";

import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";
import { ClassSubject } from "@modules/classSubjects/infra/typeorm/entities/ClassSubjects";

@injectable()
class FindClassSubjectUseCase {
  constructor(
    @inject("ClassSubjectsRepository")
    private classSubjectsRepository: IClassSubjectsRepository,
  ) {}

  async execute(id: string): Promise<Partial<ClassSubject>> {
    const {
      subject,
      quantity
    } = await this.classSubjectsRepository.findById(id);

    return {
      id,
      subject,
      quantity,
    };
  }
}

export { FindClassSubjectUseCase };
