import { inject, injectable } from "tsyringe";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";

type IReturn = {
  ok: boolean;
  message: string;
}

@injectable()
class CanDeleteEventUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,
  ) {}

  async execute(event_id: string): Promise<IReturn> {
    const messageReturn = {
      ok: true,
      message: '',
    }
    const event = await this.eventsRepository.findById(event_id);

    if (!event) {
      messageReturn.ok = false;
      messageReturn.message = 'Aula não existe'

      return messageReturn
    }

    const schedules = await this.schedulesRepository.findByEventId(event_id);

    if (schedules.length > 0) {
      messageReturn.ok = false;
      messageReturn.message = 'Aula possui alunos matriculados'

      return messageReturn
    }

    return messageReturn
  }
}

export { CanDeleteEventUseCase };
