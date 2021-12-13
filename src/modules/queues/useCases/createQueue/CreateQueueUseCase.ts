import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { Queue } from "@modules/queues/infra/typeorm/entities/Queue";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateQueueUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository
  ) {}

  async execute({
    event_id,
    user_id,
    sugestion,
  }: ICreateQueueDTO): Promise<Queue> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    const eventExists = await this.eventsRepository.findById(event_id);

    if (!eventExists) {
      throw new AppError("Event does not exists");
    }

    const queue = await this.queuesRepository.create({
      event_id,
      user_id,
      sugestion,
    });

    return queue;
  }
}

export { CreateQueueUseCase };
