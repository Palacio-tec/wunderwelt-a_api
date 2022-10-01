import { getRepository, Repository } from "typeorm";

import { ICreateScheduleCreditDTO } from "@modules/schedules/dtos/ICreateScheduleCreditDTO";
import { ISchedulesCreditsRepository } from "@modules/schedules/repositories/ISchedulesCreditsRepository";

import { ScheduleCredit } from "../entities/ScheduleCredit";

class SchedulesCreditsRepository implements ISchedulesCreditsRepository {
    private repository: Repository<ScheduleCredit>;

    constructor() {
        this.repository = getRepository(ScheduleCredit);
    }

    async create({
        id,
        schedule_id,
        credit_id,
        amount_credit
    }: ICreateScheduleCreditDTO): Promise<ScheduleCredit> {
        const scheduleCredit = this.repository.create({
            id,
            schedule_id,
            credit_id,
            amount_credit
        });
    
        await this.repository.save(scheduleCredit);
    
        return scheduleCredit;
    }

    async findByScheduleId(schedule_id: string): Promise<ScheduleCredit[]> {
        const schedulesCredits = await this.repository.find({ schedule_id });

        return schedulesCredits;
    }

    async findByCreditId(credit_id: string): Promise<ScheduleCredit[]> {
        const schedulesCredits = await this.repository.find({ credit_id });

        return schedulesCredits;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export { SchedulesCreditsRepository }