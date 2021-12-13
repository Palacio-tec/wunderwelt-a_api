import { inject, injectable } from "tsyringe";

import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";

@injectable()
class FindParameterUseCase {
  constructor(
    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository
  ) {}

  async execute(id: string) {
    const parameter = await this.parametersRepository.findById(id);

    return parameter;
  }
}

export { FindParameterUseCase };
