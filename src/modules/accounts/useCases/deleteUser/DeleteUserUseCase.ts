import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { AppError } from "@shared/errors/AppError";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";

@injectable()
class DeleteUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository,
  ) {}

  async execute(id: string, user_id: string): Promise<void> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be delete a level");
    }

    const userWillBeDeleted = await this.usersRepository.findById(id);

    if (!userWillBeDeleted) {
      throw new AppError("User does not exists");
    }

    if (userWillBeDeleted.is_teacher) {
      const listEventTeacher = await this.eventsRepository.findEventByTeacher(id);

      if (listEventTeacher.length > 0) {
        throw new AppError("User is a teacher of some event.")
      }
    }

    const statements = await this.statementsRepository.findByUserId(id);

    if (statements.length > 0) {
      throw new AppError("User has statements")
    }

    const schedules = await this.schedulesRepository.findByUserId(id)

    if (schedules.length > 0) {
      throw new AppError("User has schedules")
    }

    const queues = await this.queuesRepository.findByUser(id)

    if (queues.length > 0) {
      throw new AppError("User has queues")
    }

    const userHours = await this.hoursRepository.findByUser(id)

    if (userHours) {
      this.hoursRepository.delete(userHours.id)
    }

    await this.usersRepository.delete(id);
  }
}

export { DeleteUserUseCase };
