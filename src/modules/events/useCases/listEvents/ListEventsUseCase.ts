import { inject, injectable } from "tsyringe";

import { IListEventsDTO } from "@modules/events/dtos/IListEventsDTO";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";

@injectable()
class ListEventsUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository
  ) {}

  async execute(): Promise<IListEventsDTO[]> {
    const events = await this.eventsRepository.list();

    return events;
  }
}

export { ListEventsUseCase };
