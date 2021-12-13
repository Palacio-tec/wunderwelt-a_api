  import { inject, injectable } from "tsyringe";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { IFindAvailableDTO } from "@modules/events/dtos/IFindAvailableDTO";
import { EventLevels } from "@modules/events/infra/typeorm/entities/EventsLevels";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
interface IRequest {
  user_id: string;
  filter?: string;
}
interface ListAvailableEventsUseCaseProps extends IFindAvailableDTO{
  levels: EventLevels[];
}
@injectable()
class ListAvailableEventsUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,
  ) {}

  async execute({ user_id, filter }: IRequest): Promise<ListAvailableEventsUseCaseProps[]> {
    const parameter = await this.parametersRepository.findByReference(
      "TimeLimiteViewClass"
    );

    const timeLimiteViewClass = Number(parameter.value);

    const limiteDate = this.dateProvider.addHours(timeLimiteViewClass);
    const parseLimiteDate = this.dateProvider.convertToUTC(limiteDate);

    const events = await this.eventsRepository.findAvailable(parseLimiteDate, user_id, filter);

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

export { ListAvailableEventsUseCase };
