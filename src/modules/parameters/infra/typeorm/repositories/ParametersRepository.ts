import { getRepository, Repository } from "typeorm";

import { ICreateParameterDTO } from "@modules/parameters/dtos/ICreateParameterDTO";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";

import { Parameter } from "../entities/Parameter";

class ParametersRepository implements IParametersRepository {
  private repository: Repository<Parameter>;

  constructor() {
    this.repository = getRepository(Parameter);
  }

  async create({
    id,
    reference,
    description,
    value,
  }: ICreateParameterDTO): Promise<Parameter> {
    const parameter = this.repository.create({
      id,
      reference,
      description,
      value,
    });

    await this.repository.save(parameter);

    return parameter;
  }

  async findById(id: string): Promise<Parameter> {
    const parameter = await this.repository.findOne(id);

    return parameter;
  }

  async findByReference(reference: string): Promise<Parameter> {
    const parameter = await this.repository.findOne({ reference });

    return parameter;
  }

  async list(): Promise<Parameter[]> {
    const parameters = await this.repository.find();

    return parameters;
  }
}

export { ParametersRepository };
