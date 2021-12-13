import { inject, injectable } from "tsyringe";

import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";

@injectable()
class ConsultParameterUseCase {
  constructor(
    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository
  ) {}

  async execute(reference: string) {
    const parameter = await this.parametersRepository.findByReference(reference);

    return parameter;
  }
}

export { ConsultParameterUseCase };
