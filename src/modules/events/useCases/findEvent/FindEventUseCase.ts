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
      minimum_number_of_students,
      has_highlight,
      for_teachers,
      registered_students,
      modality,
      description_formatted,
    } = event;

    let levelsInfo = [];

    if (levels) {
      const eventLevels = await this.eventsLevelsRepository.findByEvent(id);
      const eventLevelsSorted = eventLevels.sort((a, b) => a.level.name.localeCompare(b.level.name))

      levelsInfo = await Promise.all<{value: string, label: string}>(
        eventLevelsSorted.map(async (eventLevel) => {
          return {
            value: eventLevel.level_id,
            label: eventLevel.level.name,
            info: eventLevel
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
      minimum_number_of_students,
      levels: levelsInfo,
      has_highlight,
      for_teachers,
      registered_students,
      modality,
      description_formatted,
    };
  }
}

export { FindEventUseCase };
