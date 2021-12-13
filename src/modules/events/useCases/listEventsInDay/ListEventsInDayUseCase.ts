import { inject, injectable } from "tsyringe";
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";

@injectable()
class ListEventsInDayUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository
  ) {}

  async execute({
    year,
    month,
    day,
  }): Promise<Event[]> {
    const events = await this.eventsRepository.findByDate(year, month, day);

    return events;
  }
}

export { ListEventsInDayUseCase };
