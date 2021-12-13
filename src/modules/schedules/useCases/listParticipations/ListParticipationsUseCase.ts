import { inject, injectable } from "tsyringe";

import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IListParticipationDTO } from "@modules/schedules/dtos/IListParticipationsDTO";

@injectable()
class ListPaticipationsUseCase {
  constructor(
    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository
  ) {}

  async execute(): Promise<IListParticipationDTO[]> {
    const participations = await this.schedulesRepository.listParticipations();

    return participations;
  }
}

export { ListPaticipationsUseCase };
