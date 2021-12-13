import { inject, injectable } from "tsyringe";
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";

@injectable()
class ListEventsByTeacherUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository
  ) {}

  async execute({
    teacher_id,
    start_date,
    end_date,
  }): Promise<Event[]> {
    const events = await this.eventsRepository.findEventByTeacherAndPeriod({
        teacher_id,
        start_date,
        end_date,
    });

    return events;
  }
}

export { ListEventsByTeacherUseCase };
