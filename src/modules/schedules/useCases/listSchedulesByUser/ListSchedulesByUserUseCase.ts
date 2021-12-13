import { Schedule } from "@modules/schedules/infra/typeorm/entities/Schedule";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListSchedulesByUserUserCase {
  constructor(
    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository
  ) {}

  async execute(user_id: string): Promise<Schedule[]> {
    const schedules = await this.schedulesRepository.findByUserId(user_id);

    return schedules;
  }
}

export { ListSchedulesByUserUserCase };
