import { inject, injectable } from "tsyringe";

import { Schedule } from "@modules/schedules/infra/typeorm/entities/Schedule";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";

@injectable()
class ListSchedulesUseCase {
  constructor(
    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository
  ) {}

  async execute(): Promise<Schedule[]> {
    const schedules = await this.schedulesRepository.list();

    return schedules;
  }
}

export { ListSchedulesUseCase };
