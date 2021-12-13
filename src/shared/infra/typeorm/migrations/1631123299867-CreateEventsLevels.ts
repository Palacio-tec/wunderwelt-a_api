import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEventsLevels1631123299867 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "events_levels",
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
            name: "level_id",
            type: "uuid",
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
            name: "FKLevel",
            referencedTableName: "levels",
            referencedColumnNames: ["id"],
            columnNames: ["level_id"],
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("events_levels");
  }
}
