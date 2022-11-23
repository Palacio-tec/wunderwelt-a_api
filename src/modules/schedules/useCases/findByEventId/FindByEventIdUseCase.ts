import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { Schedule } from "@modules/schedules/infra/typeorm/entities/Schedule";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class FindByEventIdUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,
  ) {}

  async execute(eventId: string): Promise<Schedule[]> {
    const eventExists = await this.eventsRepository.findById(eventId);

    if (!eventExists) {
        throw new AppError("The event does not exists");
    }

    const schedules = await this.schedulesRepository.findByEventId(eventId);

    return schedules;
  }
}

export { FindByEventIdUseCase };
