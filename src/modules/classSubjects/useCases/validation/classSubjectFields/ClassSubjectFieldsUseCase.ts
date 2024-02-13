import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";

@injectable()
class ClassSubjectFieldsUseCase {
  constructor(
    @inject("ClassSubjectsRepository")
    private classSubjectsRepository: IClassSubjectsRepository
  ) {}

  async execute(field: string, value: string, level_id?: string): Promise<boolean> {
    if (field !== 'subject') {
      throw new AppError('Field cannot be found.')
    }

    if (field === 'subject') {
      value = value.toUpperCase()
    }

    let classSubjects = []

    if (level_id !== undefined) {
        classSubjects = await this.classSubjectsRepository.findByFieldForOtherLevel(field, value, String(level_id));
    } else {
        classSubjects = await this.classSubjectsRepository.findByField(field, value);
    }

    const inUse = classSubjects.length > 0

    return inUse;
  }
}

export { ClassSubjectFieldsUseCase };
