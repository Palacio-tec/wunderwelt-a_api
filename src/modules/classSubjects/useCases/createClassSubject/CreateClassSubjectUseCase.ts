import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateClassSubjectsDTO } from "@modules/classSubjects/dtos/ICreateClassSubjectsDTO";
import { ClassSubject } from "@modules/classSubjects/infra/typeorm/entities/ClassSubjects";
import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateClassSubjectUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("ClassSubjectsRepository")
    private classSubjectsRepository: IClassSubjectsRepository
  ) {}

  async execute({
    subject,
    quantity
  }: ICreateClassSubjectsDTO, user_id: string): Promise<ClassSubject> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be create an class subject");
    }

    const classSubject = await this.classSubjectsRepository.create({
      subject,
      quantity
    });

    return classSubject;
  }
}

export { CreateClassSubjectUseCase };
