import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteQueueUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository
  ) {}

  async execute(id: string, user_id: string): Promise<void> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    const queueExists = await this.queuesRepository.findById(id);

    if (!queueExists) {
      throw new AppError("Queue does not exists");
    }

    if (queueExists.user_id !== user_id) {
      throw new AppError("User does not match");
    }

    await this.queuesRepository.delete(id);
  }
}

export { DeleteQueueUseCase };
