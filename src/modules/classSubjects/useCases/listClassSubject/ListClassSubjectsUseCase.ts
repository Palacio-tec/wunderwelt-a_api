import { inject, injectable } from "tsyringe";

import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";
import { ClassSubject } from "@modules/classSubjects/infra/typeorm/entities/ClassSubjects";

@injectable()
class ListClassSubjectsUseCase {
  constructor(
    @inject("ClassSubjectsRepository")
    private classSubjectsRepository: IClassSubjectsRepository
  ) {}

  async execute(): Promise<ClassSubject[]> {
    const classSubjects = await this.classSubjectsRepository.list();

    return classSubjects;
  }
}

export { ListClassSubjectsUseCase };
