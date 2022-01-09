import { v4 as uuidV4 } from "uuid";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from "typeorm";

import { Level } from "@modules/levels/infra/typeorm/entities/Level";

import { Event } from "./Event";

@Entity("events_levels")
class EventLevels {
  @PrimaryColumn()
  id: string;

  @Column()
  event_id: string;

  @Column()
  level_id: string;

  @ManyToOne(() => Event, event => event.id)
  @JoinColumn({ name: "event_id" })
  event: Event;

  @ManyToOne(() => Level)
  @JoinColumn({ name: "level_id" })
  level: Level;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { EventLevels };
