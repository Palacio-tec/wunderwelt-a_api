import { inject, injectable } from "tsyringe";
import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";

@injectable()
class CanScheduleUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("ClassSubjectsRepository")
    private classSubjectsRepository: IClassSubjectsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository
  ) {}

  async execute(event_id: string, user_id: string): Promise<boolean> {
    const event = await this.eventsRepository.findById(event_id)

    if (!event) {
      return false
    }

    if (!event.class_subject_id) {
        return true
    }

    const dateFormatted = new Date(event.start_date)

    const dayOfWeek = dateFormatted.getDay()

    const daysToPreviousTuesday = (dayOfWeek + 6) % 7
    const daysToNextMonday = (8 - dayOfWeek) % 7

    const startDate = new Date(dateFormatted.getTime() - daysToPreviousTuesday * 24 * 60 * 60 * 1000).toISOString()
    const lastDate = new Date(dateFormatted.getTime() + (daysToNextMonday * 24 * 60 * 60 * 1000) - 1).toISOString()

    const classSubject = await this.classSubjectsRepository.findById(event.class_subject_id)

    const quantity = await this.schedulesRepository.listQuantityByClassSubject(event.class_subject_id, user_id, startDate, lastDate);

    return quantity < Number(classSubject.quantity)
  }
}

export { CanScheduleUseCase };
