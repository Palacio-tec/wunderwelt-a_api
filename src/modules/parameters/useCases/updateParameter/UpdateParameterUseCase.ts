import { IUpdateParameterDTO } from "@modules/parameters/dtos/IUpdateParameterDTO";
import { Parameter } from "@modules/parameters/infra/typeorm/entities/Parameter";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateParameterUseCase {
  constructor(
    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository
  ) {}

  async execute({ id, value }: IUpdateParameterDTO): Promise<Parameter> {
    const parameterExist = await this.parametersRepository.findById(id);

    if (!parameterExist) {
      throw new AppError("Parameter does not exists");
    }

    const { reference, description } = parameterExist;

    const parameter = await this.parametersRepository.create({
      id,
      reference,
      description,
      value,
    });

    return parameter;
  }
}

export { UpdateParameterUseCase };
