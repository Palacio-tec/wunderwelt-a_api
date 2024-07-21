import { getRepository, Repository, Raw } from "typeorm";

import { ICreateEventDTO } from "@modules/events/dtos/ICreateEventDTO";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";

import { Event } from "../entities/Event";
import { IFindAllInMonthDTO } from "@modules/events/dtos/IFindAllInMonthDTO";
import { IFindAvailableDTO, IFindAvailableProps } from "@modules/events/dtos/IFindAvailableDTO";
import { IFindRegisteredByUserDTO } from "@modules/events/dtos/IFindRegisteredByUserDTO";
import { IFindWaitingListByUserDTO } from "@modules/events/dtos/IFindWaitingListByUserDTO";
import { IFindRegisteredDTO } from "@modules/events/dtos/IFindRegisteredDTO";
import { IListEventsDTO } from "@modules/events/dtos/IListEventsDTO";
import { IFindEventByTeacherAndPeriodDTO } from "@modules/events/dtos/IFindEventByTeacherAndPeriodDTO";
import { IFindEventWillStartDTO } from "@modules/events/dtos/IFindEventWillStartDTO";
import { IFindEventWithoutStudentByDateDTO } from "@modules/events/dtos/IFindEventWithoutStudentByDateDTO";
class EventsRepository implements IEventsRepository {
  private repository: Repository<Event>;

  constructor() {
    this.repository = getRepository(Event);
  }

  async create({
    id,
    title,
    description,
    link,
    start_date,
    end_date,
    student_limit,
    teacher_id,
    instruction,
    is_canceled,
    credit,
    request_subject,
    minimum_number_of_students,
    has_highlight,
    for_teachers,
    modality,
    description_formatted,
    class_subject_id,
  }: ICreateEventDTO): Promise<Event> {
    const event = this.repository.create({
      title,
      description,
      link,
      start_date,
      end_date,
      student_limit,
      teacher_id,
      instruction,
      is_canceled,
      credit,
      id,
      request_subject,
      minimum_number_of_students,
      has_highlight,
      for_teachers,
      modality,
      description_formatted,
      class_subject_id,
    });

    await this.repository.save(event);

    return event;
  }

  async list(): Promise<IListEventsDTO[]> {
    const events = await this.repository.query(
      `SELECT
        e.id, e.title, e.description, e.link, e.start_date, e.end_date, e.student_limit,
        e.instruction, e.is_canceled, e.credit, e.teacher_id, e.minimum_number_of_students,
        e.has_highlight, e.for_teachers, e.modality, e.description_formatted, e.class_subject_id,
        u.name,
        cs.subject,
        string_agg(l.name, ', ') levels
      FROM
        events e
      INNER JOIN
        users u
      ON
        u.id = e.teacher_id
      LEFT JOIN
        events_levels el
      ON
        el.event_id = e.id
      LEFT JOIN
        levels l
      ON
        l.id = el.level_id
      LEFT JOIN
        class_subjects cs
      ON
        cs.id = e.class_subject_id
      GROUP BY
        e.id, e.title, e.description, e.link, e.start_date, e.end_date, e.student_limit,
        e.instruction, e.is_canceled, e.credit, e.teacher_id, e.minimum_number_of_students,
        e.has_highlight, e.for_teachers, e.modality, e.description_formatted, e.class_subject_id,
        u.name,
        cs.subject
      ORDER BY
        e.created_at DESC`
    );

    return events;
  }

  async findAvailable({
    date,
    user_id,
    filter,
    isTeacher,
  }: IFindAvailableProps): Promise<IFindAvailableDTO[]> {
    const events = await this.repository.query(
      `SELECT ea.* FROM (
        SELECT 
          e.id, e.title, e.description, e.link, e.start_date, e.end_date,
          e.student_limit, e.credit, e.request_subject, e.has_highlight,
          e.for_teachers, e.modality, e.description_formatted, e.class_subject_id,
          COUNT(s.event_id) AS registered_students
        FROM
          events e
        LEFT JOIN
          schedules s
        ON
          s.event_id = e.id
        WHERE
          e.start_date >= '${date}' AND
          NOT e.is_canceled
          AND (
            lower(e.title) like '%${filter}%'
            OR lower(e.description) like '%${filter}%'
          )
          ${!isTeacher ? 'AND e.for_teachers = false' : ''}
        GROUP BY
          e.id, e.title, e.description, e.link, e.start_date, e.end_date,
          e.student_limit, e.credit, e.request_subject, e.has_highlight,
          e.for_teachers, e.modality, e.description_formatted, e.class_subject_id
      ) ea
      LEFT JOIN
        schedules suser
      ON
        suser.event_id = ea.id
        AND suser.user_id = '${user_id}'
      LEFT JOIN
        queues q
      ON
        q.event_id = ea.id
        AND q.user_id = '${user_id}'
      WHERE
        suser.id IS NULL
        AND ( q.id IS NULL OR ea.registered_students < ea.student_limit )
      ORDER BY
        ${isTeacher ? 'ea.for_teachers DESC,' : ''}
        ea.start_date`
    );

    return events;
  }

  async findById(id: string): Promise<IListEventsDTO> {
    const event = await this.repository.query(
      `SELECT
        e.id, e.title, e.description, e.link, e.start_date, e.end_date, e.student_limit,
        e.instruction, e.is_canceled, e.credit, e.teacher_id, e.request_subject,
        e.minimum_number_of_students, e.has_highlight, e.for_teachers, e.modality, e.description_formatted,
        e.class_subject_id,
        u.name,
        cs.subject,
        COUNT(s.event_id) AS registered_students,
        string_agg(l.name, ', ') levels
      FROM
        events e
      INNER JOIN
        users u
      ON
        u.id = e.teacher_id
      LEFT JOIN
        events_levels el
      ON
        el.event_id = e.id
      LEFT JOIN
        levels l
      ON
        l.id = el.level_id
      LEFT JOIN
        schedules s
      ON
        s.event_id = e.id
      LEFT JOIN
        class_subjects cs
      ON
        cs.id = e.class_subject_id
      WHERE
        e.id = '${id}'
      GROUP BY
        e.id, e.title, e.description, e.link, e.start_date, e.end_date, e.student_limit,
        e.instruction, e.is_canceled, e.credit, e.teacher_id, e.request_subject,
        e.minimum_number_of_students, e.has_highlight, e.for_teachers, e.modality, e.description_formatted,
        e.class_subject_id,
        u.name,
        cs.subject`
    );

    return event[0];
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAllInMonth({ year, month }: IFindAllInMonthDTO): Promise<Event[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const events = await this.repository.query(
      `SELECT
        e.id, e.title, e.description, e.link, e.start_date, e.end_date,
        e.student_limit, e.instruction, e.is_canceled, e.credit, e.teacher_id,
        e.minimum_number_of_students, e.has_highlight, e.for_teachers, e.modality, e.description_formatted,
        e.class_subject_id,
        u.name,
        string_agg(l.name, ', ') levels
      FROM
        events e
      INNER JOIN
        users u
      ON
        u.id = e.teacher_id
      LEFT JOIN
        events_levels el
      ON
        el.event_id = e.id
      LEFT JOIN
        levels l
      ON
        l.id = el.level_id
      WHERE
        to_char(e.start_date, 'MM-YYYY') = '${parsedMonth}-${year}'
      GROUP BY
        e.id, e.title, e.description, e.link, e.start_date, e.end_date,
        e.student_limit, e.instruction, e.is_canceled, e.credit, e.teacher_id,
        e.minimum_number_of_students, e.has_highlight, e.for_teachers, e.modality, e.description_formatted,
        e.class_subject_id,
        u.name
      ORDER BY
        e.start_date DESC`
    );

    return events;
  }

  async findByDate(year: number, month: number, day: number): Promise<Event[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const events = await this.repository.find({
      where: {
        start_date: Raw(start_dateFieldName => 
          `to_char(${start_dateFieldName} at time zone 'utc' at time zone 'America/Sao_Paulo', 'YYYY-MM-DD') = '${year}-${parsedMonth}-${parsedDay}'`
        ),
      },
      order: {
        start_date: "ASC",
      },
      relations: ['user'],
    })

    return events;
  }

  async findRegisteredByUser({ user_id, willStart = false }: IFindRegisteredByUserDTO): Promise<IFindRegisteredDTO[]> {
    let where = ''

    if (willStart) {
      where = `WHERE e.start_date >= '${new Date()}'`
    }

    const events = await this.repository.query(
      `SELECT 
        e.id, e.title, e.description, e.link, e.start_date, e.end_date,
        e.credit, e.request_subject, e.has_highlight, e.for_teachers, e.modality,
        e.description_formatted
      FROM
        events e
      INNER JOIN
        schedules s
      ON
        s.event_id = e.id
        AND s.user_id = '${user_id}'
      ${where}
      ORDER BY
        e.start_date`
    );

    return events;
  }

  async findWaitingListByUser({ user_id }: IFindWaitingListByUserDTO): Promise<IFindRegisteredDTO[]> {
    const events = await this.repository.query(
      `SELECT 
        e.id, e.title, e.description, e.link, e.start_date, e.end_date
      FROM
        events e
      INNER JOIN
        queues q
      ON
        q.event_id = e.id
        AND q.user_id = '${user_id}'
      WHERE
        e.start_date >= '${new Date()}'
      ORDER BY
        e.start_date`
    );

    return events;
  }

  async findEventByTeacher(teacher_id: string): Promise<Event[]> {
    const events = await this.repository.find({
      where: { teacher_id },
      relations: ['user'],
    });

    return events;
  }

  async findEventByTeacherAndPeriod({teacher_id, start_date, end_date}: IFindEventByTeacherAndPeriodDTO): Promise<Event[]> {
    const events = await this.repository.find({
      where: {
        teacher_id,
        start_date: Raw(start_dateFieldName => 
          `to_char(${start_dateFieldName}, 'YYYY-MM-DD') BETWEEN '${start_date}' AND '${end_date}'`
        ),
      },
      order: {
        start_date: "ASC",
      },
      relations: ['user'],
    })

    return events;
  }

  async findByIdToCreate(id: string): Promise<Event> {
    const event = await this.repository.findOne(id);

    return event;
  }

  async findEventWillStart(startDate: string, endDate: string): Promise<IFindEventWillStartDTO[]> {
    const events = await this.repository.query(
      `SELECT
        e.id as event_id, e.title, e.description, e.link, e.start_date, e.teacher_id, e.modality, e.description_formatted, e.instruction,
        u.name as teacher_name, u.email as teacher_email
      FROM
        events e
      INNER JOIN
        users u
      ON
        u.id = e.teacher_id
      INNER JOIN
        schedules s
      ON
        s.event_id = e.id
      WHERE
        e.start_date BETWEEN '${startDate}' and '${endDate}'
        and e.is_canceled = false
      GROUP BY
        e.id, e.title, e.description, e.link, e.start_date, e.teacher_id, e.modality, e.description_formatted, e.instruction,
        u.name, u.email`
    );

    return events;
  }

  async findEventWithoutStudentByDate(startDate: string, endDate: string): Promise<IFindEventWithoutStudentByDateDTO[]> {
    const events = await this.repository.query(
      `SELECT * FROM (
        SELECT
          e.id as event_id, e.title, e.start_date, e.minimum_number_of_students,
          u.id as teacher_id, u.name as teacher_name, u.email as teacher_email,
          SUM(
            CASE WHEN s.id IS NULL THEN 0 ELSE 1 END
          ) as student_qty
        FROM
          events e
        INNER JOIN
          users u
        ON
          u.id = e.teacher_id
        LEFT JOIN
          schedules s
        ON
          s.event_id = e.id
        WHERE
          e.start_date BETWEEN '${startDate}' AND '${endDate}' AND
          e.is_canceled = false
        GROUP BY
          e.id, e.title, e.start_date, e.minimum_number_of_students,
          u.id, u.name, u.email
      ) eventWithoutStudent
      WHERE
        eventWithoutStudent.student_qty = 0`
    );

    return events;
  }

  async findByHighlightAndWillStart(year: number, month: number, day: number): Promise<Event[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const events = await this.repository.find({
      select: ['id', 'title', 'description', 'start_date', 'credit', 'event_levels'],
      where: {
        start_date: Raw(start_dateFieldName => 
          `to_char(${start_dateFieldName}, 'YYYY-MM-DD') >= '${year}-${parsedMonth}-${parsedDay}'`
        ),
        has_highlight: true,
        for_teachers: false,
        is_canceled: false,
      },
      order: {
        start_date: "ASC",
      },
      relations: ['event_levels', 'event_levels.level'],
    })

    return events;
  }

  async findByUserIdAndDate(user_id: string, eventDate: string): Promise<IFindEventWillStartDTO[]> {
    const events = await this.repository.query(
      `SELECT
        e.id as event_id, e.title, e.description, e.link, e.start_date,
        e.teacher_id, e.modality, e.description_formatted,
        u.name as teacher_name, u.email as teacher_email
      FROM
        events e
      INNER JOIN
        users u
      ON
        u.id = e.teacher_id
      INNER JOIN
        schedules s
      ON
        s.event_id = e.id
      WHERE
        e.start_date BETWEEN '${eventDate} 00:00:00' AND '${eventDate} 23:59:59' AND
        s.user_id = '${user_id}'
      GROUP BY
        e.id, e.title, e.description, e.link, e.start_date, e.teacher_id,
        e.modality, e.description_formatted,
        u.name, u.email`
    );

    return events;
  }

  async findEventByPeriod(start_date: string, end_date: string): Promise<Event[]> {
    const events = await this.repository.find({
      where: {
        start_date: Raw(start_dateFieldName => 
          `to_char(${start_dateFieldName}, 'YYYY-MM-DD') BETWEEN '${start_date}' AND '${end_date}'`
        ),
      },
      order: {
        start_date: "ASC",
      },
      relations: ['user'],
    })

    return events;
  }

  async findByClassSubject(class_subject_id: string): Promise<Event[]> {
    const events = await this.repository.find({ class_subject_id });

    return events;
  }
}

export { EventsRepository };
