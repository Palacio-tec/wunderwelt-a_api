import { ICreateScheduleDTO } from "../dtos/ICreateScheduleDTO";
import { IListParticipationDTO } from "../dtos/IListParticipationsDTO";
import { Schedule } from "../infra/typeorm/entities/Schedule";

interface ISchedulesRepository {
  create(date: ICreateScheduleDTO): Promise<Schedule>;
  findByUserId(user_id: string): Promise<Schedule[]>;
  findByEventId(event_id: string): Promise<Schedule[]>;
  findByEventDate(date: string, user_id: string): Promise<Schedule[]>;
  deleteById(id: string): Promise<void>;
  findById(id: string): Promise<Schedule>;
  list(): Promise<Schedule[]>;
  findByEventIdAndUserId(eventId: string, user_id: string): Promise<Schedule>;
  listParticipations(): Promise<IListParticipationDTO[]>;
  listUserHistoric(user_id: string): Promise<{id: string, name: string, title: string, start_date: string}[]>;
}

export { ISchedulesRepository };
