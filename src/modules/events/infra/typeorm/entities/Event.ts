import { randomUUID as uuidV4 } from 'crypto'

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Exclude } from "class-transformer";
import { EventLevels } from "./EventsLevels";
import { OperationEnumModalityEvent } from "@modules/events/dtos/ICreateEventDTO";
import { ClassSubject } from '@modules/classSubjects/infra/typeorm/entities/ClassSubjects';

@Entity("events")
class Event {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  @Exclude()
  link: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  student_limit: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  teacher_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "teacher_id" })
  user: User;

  @Column()
  @Exclude()
  instruction: string;

  @Column()
  is_canceled: boolean;

  @Column()
  credit: number;

  @Column()
  request_subject: boolean;

  @Column()
  minimum_number_of_students: number;

  @Column()
  has_highlight: boolean;

  @Column()
  for_teachers: boolean;

  @OneToMany(() => EventLevels, eventLevels => eventLevels.event)
  @JoinColumn({ name: 'id' })
  event_levels: EventLevels[];

  @Column({ type: "enum", enum: OperationEnumModalityEvent })
  modality: OperationEnumModalityEvent;

  @Column()
  description_formatted: string;

  @Column()
  class_subject_id: string

  @ManyToOne(() => ClassSubject, classSubject => classSubject.id)
  @JoinColumn({ name: 'class_subject_id' })
  class_subject: ClassSubject

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Event };
