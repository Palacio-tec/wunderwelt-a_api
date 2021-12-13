import { inject, injectable } from "tsyringe";
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";

type AvailableDays = Array<{
  day: number;
  available: boolean;
}>

@injectable()
class ListEventsMonthlyUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository
  ) {}

  async execute({
    year,
    month,
  }): Promise<Event[]> {
    const events = await this.eventsRepository.findAllInMonth({year, month});

    return events;
  }
}

export { ListEventsMonthlyUseCase };
