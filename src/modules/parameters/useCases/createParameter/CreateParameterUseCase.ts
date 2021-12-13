import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ICreateParameterDTO } from "@modules/parameters/dtos/ICreateParameterDTO";
import { Parameter } from "@modules/parameters/infra/typeorm/entities/Parameter";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateParameterUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository
  ) {}

  async execute({
    description,
    reference,
    value,
    id
  }: ICreateParameterDTO): Promise<Parameter> {
    const parameter = await this.parametersRepository.create({
      description,
      reference,
      value
    });

    return parameter;
  }
}

export { CreateParameterUseCase };
