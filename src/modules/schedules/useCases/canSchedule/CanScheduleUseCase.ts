import { inject, injectable } from "tsyringe";
import { format } from "date-fns";
import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CanScheduleUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("ClassSubjectsRepository")
    private classSubjectsRepository: IClassSubjectsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,
  ) {}

  async execute(class_subject_id: string, user_id: string): Promise<boolean> {
    if (!class_subject_id) {
        return true
    }

    const classSubject = await this.classSubjectsRepository.findById(class_subject_id)

    const dateNow = format(new Date(), 'yyyy-MM-dd HH:mm');

    const quantity = await this.schedulesRepository.listQuantityByClassSubject(class_subject_id, user_id, dateNow);

    return quantity < Number(classSubject.quantity)
  }
}

export { CanScheduleUseCase };
