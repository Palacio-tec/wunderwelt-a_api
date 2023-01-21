import {
    Column,
    CreateDateColumn,
    Entity,
    ObjectID,
    ObjectIdColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("mail_logs")
class MailLog {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    content: string;

    @Column("uuid")
    user_id: string;

    @Column({ default: false })
    error: boolean = false;

    @Column()
    message: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export { MailLog };
