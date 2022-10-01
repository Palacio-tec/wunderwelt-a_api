import { ICreateScheduleCreditDTO } from "../dtos/ICreateScheduleCreditDTO";
import { ScheduleCredit } from "../infra/typeorm/entities/ScheduleCredit";

interface ISchedulesCreditsRepository {
  create(date: ICreateScheduleCreditDTO): Promise<ScheduleCredit>;
  findByScheduleId(schedule_id: string): Promise<ScheduleCredit[]>;
  findByCreditId(credit_id: string): Promise<ScheduleCredit[]>;
  delete(id: string): Promise<void>;
}

export { ISchedulesCreditsRepository };
