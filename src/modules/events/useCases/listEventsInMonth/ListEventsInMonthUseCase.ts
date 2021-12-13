import { inject, injectable } from "tsyringe";
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";

type AvailableDays = Array<{
  day: number;
  available: boolean;
}>

@injectable()
class ListEventsInMonthUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository
  ) {}

  async execute({
    year,
    month,
  }): Promise<AvailableDays> {
    const events = await this.eventsRepository.findAllInMonth({year, month});

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const eventInDay = events.filter(event => {
        return getDate(event.start_date) === day
      });

      return {
        day,
        available: isAfter(compareDate, new Date()) && eventInDay.length > 0
      }
    });

    return availability;
  }
}

export { ListEventsInMonthUseCase };
