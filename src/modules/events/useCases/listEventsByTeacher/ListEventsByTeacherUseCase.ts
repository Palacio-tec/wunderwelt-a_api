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
    let events = []

    if (!!teacher_id && !!start_date && !!end_date) {
      events = await this.eventsRepository.findEventByTeacherAndPeriod({
          teacher_id,
          start_date,
          end_date,
      });
    } else if (!!teacher_id) {
      events = await this.eventsRepository.findEventByTeacher(teacher_id);
    } else {
      events = await this.eventsRepository.findEventByPeriod(
        start_date,
        end_date
      );
    }

    return events;
  }
}

export { ListEventsByTeacherUseCase };
