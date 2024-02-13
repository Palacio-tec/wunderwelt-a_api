import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";
import { ICreateClassSubjectsDTO } from "@modules/classSubjects/dtos/ICreateClassSubjectsDTO";
import { AppError } from "@shared/errors/AppError";
import { ClassSubject } from "@modules/classSubjects/infra/typeorm/entities/ClassSubjects";

@injectable()
class UpdateClassSubjectUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("ClassSubjectsRepository")
    private classSubjectsRepository: IClassSubjectsRepository
  ) {}

  async execute({
      id,
      subject,
      quantity,
    }: ICreateClassSubjectsDTO,
    user_id: string
  ): Promise<ClassSubject> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be update a class subject");
    }

    const classSubjectIdExists = await this.classSubjectsRepository.findById(id);

    if (!classSubjectIdExists) {
      throw new AppError("Class subject does not exists");
    }

    const classSubject = this.classSubjectsRepository.create({
      id,
      subject,
      quantity
    });

    return classSubject;
  }
}

export { UpdateClassSubjectUseCase };
