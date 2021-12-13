import { ICreateEventDTO } from "../dtos/ICreateEventDTO";
import { IFindAllInMonthDTO } from "../dtos/IFindAllInMonthDTO";
import { IFindAvailableDTO } from "../dtos/IFindAvailableDTO";
import { IFindEventByTeacherAndPeriodDTO } from "../dtos/IFindEventByTeacherAndPeriodDTO";
import { IFindEventWillStartDTO } from "../dtos/IFindEventWillStartDTO";
import { IFindEventWithoutStudentByDateDTO } from "../dtos/IFindEventWithoutStudentByDateDTO";
import { IFindRegisteredByUserDTO } from "../dtos/IFindRegisteredByUserDTO";
import { IFindRegisteredDTO } from "../dtos/IFindRegisteredDTO";
import { IFindWaitingListByUserDTO } from "../dtos/IFindWaitingListByUserDTO";
import { IListEventsDTO } from "../dtos/IListEventsDTO";
import { Event } from "../infra/typeorm/entities/Event";
interface IEventsRepository {
  create(data: ICreateEventDTO): Promise<Event>;
  list(): Promise<IListEventsDTO[]>;
  findAvailable(date: string, user_id: string, filter?: string): Promise<IFindAvailableDTO[]>;
  findById(id: string): Promise<IListEventsDTO>;
  delete(id: string): Promise<void>;
  findAllInMonth({ year, month }: IFindAllInMonthDTO): Promise<Event[]>;
  findByDate(year: number, month: number, day: number): Promise<Event[]>;
  findRegisteredByuser({ user_id, willStart }: IFindRegisteredByUserDTO): Promise<IFindRegisteredDTO[]>;
  findWaitingListByuser({ user_id }: IFindWaitingListByUserDTO): Promise<IFindRegisteredDTO[]>;
  findEventByTeacher(teacher_id: string): Promise<Event[]>;
  findByIdToCreate(id: string): Promise<Event>;
  findEventByTeacherAndPeriod({teacher_id, start_date, end_date}: IFindEventByTeacherAndPeriodDTO): Promise<Event[]>;
  findEventWillStart(startDate: string, endDate: string): Promise<IFindEventWillStartDTO[]>;
  findEventWithoutStudentByDate(startDate: string, endDate: string): Promise<IFindEventWithoutStudentByDateDTO[]>;
}

export { IEventsRepository };
