import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { Event } from "@modules/events/infra/typeorm/entities/Event";

@injectable()
class CanceledEventUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,
  ) {}

  async execute(id: string): Promise<Event> {
    const event = await this.eventsRepository.findByIdToCreate(id);

    if (!event) {
      throw new AppError("Event does not exists");
    }
    event.is_canceled = !event.is_canceled;

    await this.eventsRepository.create(event);

    return event;
  }
}

export { CanceledEventUseCase };
