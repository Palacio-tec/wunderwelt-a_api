import { Queue } from "@modules/queues/infra/typeorm/entities/Queue";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  user_id: string;
}
  
@injectable()
class ListAvailableQueuesUseCase {
  constructor(
    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository
  ) {}

  async execute({ user_id }: IRequest): Promise<Queue[]> {
    const queues = await this.queuesRepository.findAvailableByUser(user_id);

    return queues;
  }
}

export { ListAvailableQueuesUseCase };
