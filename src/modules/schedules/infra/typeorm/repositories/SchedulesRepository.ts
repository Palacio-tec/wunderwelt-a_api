import { getRepository, Repository } from "typeorm";

import { ICreateScheduleDTO } from "@modules/schedules/dtos/ICreateScheduleDTO";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";

import { Schedule } from "../entities/Schedule";
import { IListParticipationDTO } from "@modules/schedules/dtos/IListParticipationsDTO";

class SchedulesRepository implements ISchedulesRepository {
  private repository: Repository<Schedule>;

  constructor() {
    this.repository = getRepository(Schedule);
  }
  async create({
    id,
    event_id,
    user_id,
    subject,
  }: ICreateScheduleDTO): Promise<Schedule> {
    const schedule = this.repository.create({
      id,
      event_id,
      user_id,
      subject,
    });

    await this.repository.save(schedule);

    return schedule;
  }

  async findByUserId(user_id: string): Promise<Schedule[]> {
    const schedules = await this.repository.find({
      where: { user_id },
      relations: ["event"],
    });

    return schedules;
  }

  async findByEventId(event_id: string): Promise<Schedule[]> {
    const schedules = await this.repository.find({
      where: { event_id },
      relations: ["event", "user"],
    });

    return schedules;
  }

  async findByEventDate(date: string, user_id: string): Promise<Schedule[]> {
    const schedules = await this.repository.query(
      `SELECT s.* FROM schedules s
        INNER JOIN events e ON e.id = s.event_id
        WHERE s.user_id = '${user_id}'
          AND '${date}' BETWEEN e.start_date AND e.end_date`
    );

    return schedules;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findById(id: string): Promise<Schedule> {
    const schedule = await this.repository.findOne(id);

    return schedule;
  }

  async list(): Promise<Schedule[]> {
    return await this.repository.find({
      relations: ["event", "user"]
    });
  }

  async findByEventIdAndUserId(eventId: string, user_id: string): Promise<Schedule> {
    const schedule = await this.repository.findOne({
      where: { event_id: eventId, user_id },
      relations: ["event"],
    });

    return schedule;
  }

  async listParticipations(): Promise<IListParticipationDTO[]> {
    const participations = await this.repository.query(
      `SELECT
        base_gift.*,
        COALESCE(SUM(s.amount), 0) as gift_credits,
        MAX(s.created_at) as last_gift
      FROM (
        SELECT
          u.id as user_id, u.name, u.email, u.created_at,
          COUNT(e.id) as participation,
          SUM(CASE WHEN e.credit is null THEN 0 ELSE e.credit END) as total_spent
        FROM
          users u
        LEFT JOIN
          schedules s
        ON
          s.user_id = u.id
        LEFT JOIN
          events e
        ON
          e.id = s.event_id
        WHERE
          u.inactivation_date is null
          AND is_admin = false
        GROUP BY
          u.id, u.name, u.email, u.created_at
      ) base_gift
      LEFT JOIN
        statements s
      ON
        s.user_id = base_gift.user_id
        AND s.is_gift
      GROUP BY
        base_gift.user_id,
        base_gift.name,
        base_gift.email,
        base_gift.participation,
        base_gift.total_spent,
        base_gift.created_at
      ORDER BY
        base_gift.total_spent DESC,
        base_gift.participation DESC`
    )

    return participations;
  }

}

export { SchedulesRepository };
