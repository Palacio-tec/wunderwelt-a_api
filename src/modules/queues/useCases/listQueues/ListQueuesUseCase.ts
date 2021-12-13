import { Queue } from "@modules/queues/infra/typeorm/entities/Queue";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListQueuesUseCase {
  constructor(
    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository
  ) {}

  async execute(): Promise<Queue[]> {
    const queues = await this.queuesRepository.list();

    return queues;
  }
}

export { ListQueuesUseCase };
