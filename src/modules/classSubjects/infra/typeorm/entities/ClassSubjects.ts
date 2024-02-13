import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { randomUUID as uuidV4 } from 'crypto'
import { Event } from "@modules/events/infra/typeorm/entities/Event";

@Entity("class_subjects")
class ClassSubject {
    @PrimaryColumn()
    id: string;

    @Column()
    subject: string;

    @Column()
    quantity: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Event, event => event.class_subject)
    @JoinColumn({ name: 'class_subject_id' })
    events: Event[]

    constructor() {
        if (!this.id) {
          this.id = uuidV4();
        }
      }
}

export { ClassSubject }
