import { ICreateEventLevelDTO } from "../dtos/ICreateEventLevelDTO";
import { EventLevels } from "../infra/typeorm/entities/EventsLevels";

interface IEventsLevelsRepository {
  create(data: ICreateEventLevelDTO): Promise<void>;
  findByEvent(event_id: string): Promise<EventLevels[]>;
  deleteByEvent(event_id: string): Promise<void>;
  findByLevel(level_id: string): Promise<EventLevels[]>;
}

export { IEventsLevelsRepository };
