import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateEventDTO } from "@modules/events/dtos/ICreateEventDTO";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateEventUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository
  ) {}

  async execute(
    {
      id,
      title,
      description,
      link,
      start_date,
      end_date,
      student_limit,
      teacher_id,
      instruction,
      credit,
      request_subject,
      levels,
    }: ICreateEventDTO,
    user_id: string
  ): Promise<Event> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("User is not administrators");
    }

    const eventExists = await this.eventsRepository.findById(id);

    if (!eventExists) {
      throw new AppError("Event does not exists");
    }

    const schedulesExists = await this.schedulesRepository.findByEventId(id);

    if (schedulesExists.length > 0) {
      throw new AppError("Event has enrolled students");
    }

    const parseStartDate = this.dateProvider.parseISO(start_date);
    const parseEndDate = this.dateProvider.parseISO(end_date);

    const event = await this.eventsRepository.create({
      id,
      title,
      description,
      link,
      start_date: parseStartDate,
      end_date: parseEndDate,
      student_limit,
      teacher_id,
      credit,
      request_subject,
      instruction,
    });

    await this.eventsLevelsRepository.deleteByEvent(id);

    await Promise.all(
      levels.split(",").map(async (level_id: string) => {
        const levelExist = await this.levelsRepository.findById(level_id);

        if (!levelExist) {
          throw new AppError("Level does not exists");
        }

        await this.eventsLevelsRepository.create({ event_id: id, level_id });
      })
    )

    return event;
  }
}

export { UpdateEventUseCase };
