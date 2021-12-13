import { inject, injectable } from "tsyringe";

import { IFindEventDTO } from "@modules/events/dtos/IFindEventDTO";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";

type Level = {
  name: string;
};

@injectable()
class FindEventUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,
  ) {}

  async execute(id: string): Promise<IFindEventDTO> {
    const event = await this.eventsRepository.findById(id);

    const {
      title,
      description,
      link,
      start_date,
      end_date,
      student_limit,
      instruction,
      is_canceled,
      teacher_id,
      name,
      credit,
      request_subject,
      levels,
    } = event;

    let levelsInfo = [];

    if (levels) {
      const eventLevels = await this.eventsLevelsRepository.findByEvent(id);

      levelsInfo = await Promise.all<{value: string, label: string}>(
        eventLevels.map(async (eventLevel) => {
          return {
            value: eventLevel.level_id,
            label: eventLevel.level.name,
          }
        })
      );
    }

    return {
      id,
      title,
      description,
      link,
      start_date,
      end_date,
      student_limit,
      instruction,
      is_canceled,
      teacher_id,
      name,
      credit,
      request_subject,
      levels: levelsInfo,
    };
  }
}

export { FindEventUseCase };
