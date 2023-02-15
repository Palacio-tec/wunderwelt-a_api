import {
    Column,
    CreateDateColumn,
    Entity,
    ObjectID,
    ObjectIdColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("notifications")
class Notifications {
    @ObjectIdColumn()
    id: ObjectID;

    @Column("uuid")
    user_id: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ default: false })
    read: boolean = false;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export { Notifications };
