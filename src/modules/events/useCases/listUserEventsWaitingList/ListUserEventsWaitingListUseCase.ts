import { inject, injectable } from "tsyringe";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { EventLevels } from "@modules/events/infra/typeorm/entities/EventsLevels";
import { IFindRegisteredDTO } from "@modules/events/dtos/IFindRegisteredDTO";

interface IRequest {
  user_id: string;
}

interface ListUserEventsWaitingListUseCaseProps extends IFindRegisteredDTO{
  levels: EventLevels[];
}

@injectable()
class ListUserEventsWaitingListUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<ListUserEventsWaitingListUseCaseProps[]> {
    const events = await this.eventsRepository.findWaitingListByuser({ user_id });

    const eventsWithLevels = await Promise.all(events.map(async event => {
      const levels = await this.eventsLevelsRepository.findByEvent(event.id)

      return {
        ...event,
        levels
      }
    }))

    return eventsWithLevels;
  }
}

export { ListUserEventsWaitingListUseCase };
