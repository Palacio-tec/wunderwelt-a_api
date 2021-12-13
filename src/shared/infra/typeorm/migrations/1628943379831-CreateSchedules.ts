import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSchedules1628943379831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "schedules",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "event_id",
            type: "uuid",
          },
          {
            name: "user_id",
            type: "uuid",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKEvent",
            referencedTableName: "events",
            referencedColumnNames: ["id"],
            columnNames: ["event_id"],
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
          {
            name: "FKUser",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["user_id"],
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("schedules");
  }
}
