import { getRepository, Repository } from "typeorm";

import { ICreateEventLevelDTO } from "@modules/events/dtos/ICreateEventLevelDTO";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";

import { EventLevels } from "../entities/EventsLevels";

class EventsLevelsRepository implements IEventsLevelsRepository {
  private repository: Repository<EventLevels>;

  constructor() {
    this.repository = getRepository(EventLevels);
  }

  async create({
    id,
    event_id,
    level_id,
  }: ICreateEventLevelDTO): Promise<void> {
    const eventLevel = this.repository.create({
      id,
      event_id,
      level_id,
    });

    await this.repository.save(eventLevel);
  }

  async findByEvent(event_id: string): Promise<EventLevels[]> {
    const eventsLevels = this.repository.find({ where: {event_id}, relations: ['level'] });

    return eventsLevels;
  }

  async deleteByEvent(event_id: string): Promise<void> {
    const eventsLevels = await this.repository.find({ event_id });

    eventsLevels.map(async (eventLevel) => {
      await this.repository.delete(eventLevel.id);
    });
  }

  async findByLevel(level_id: string): Promise<EventLevels[]> {
    const eventLevels = this.repository.find({ level_id });

    return eventLevels;
  }
}

export { EventsLevelsRepository };
