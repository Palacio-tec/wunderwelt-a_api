import { Parameter } from "@modules/parameters/infra/typeorm/entities/Parameter";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListParametersUseCase {
  constructor(
    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository
  ) {}

  async execute(): Promise<Parameter[]> {
    const parameters = await this.parametersRepository.list();

    return parameters;
  }
}

export { ListParametersUseCase };
