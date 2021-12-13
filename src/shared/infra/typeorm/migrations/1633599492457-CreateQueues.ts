import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateQueues1633599492457 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "queues",
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
            name: "sugestion",
            type: "varchar",
            isNullable: true,
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
    await queryRunner.dropTable("queues");
  }
}
