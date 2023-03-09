  import { inject, injectable } from "tsyringe";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { IFindAvailableDTO } from "@modules/events/dtos/IFindAvailableDTO";
import { EventLevels } from "@modules/events/infra/typeorm/entities/EventsLevels";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
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

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ user_id, filter }: IRequest): Promise<ListAvailableEventsUseCaseProps[]> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    const { is_teacher: isTeacher } = userExists;

    const parameter = await this.parametersRepository.findByReference(
      "TimeLimiteViewClass"
    );

    const timeLimiteViewClass = Number(parameter.value);

    const limiteDate = this.dateProvider.addHours(timeLimiteViewClass);
    const parseLimiteDate = this.dateProvider.convertToUTC(limiteDate);

    const events = await this.eventsRepository.findAvailable({
      date: parseLimiteDate,
      user_id,
      filter,
      isTeacher
    });

    const eventsWithLevels = await Promise.all(events.map(async event => {
      const levels = await this.eventsLevelsRepository.findByEvent(event.id)

      const levelsSorted = levels.sort((a, b) => a.level.name.localeCompare(b.level.name))

      return {
        ...event,
        levels: levelsSorted
      }
    }))

    return eventsWithLevels;
  }
}

export { ListAvailableEventsUseCase };
