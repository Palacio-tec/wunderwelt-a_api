import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEvents1628673885401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: "events",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "link",
            type: "varchar",
          },
          {
            name: "start_date",
            type: "timestamp",
          },
          {
            name: "end_date",
            type: "timestamp",
          },
          {
            name: "student_limit",
            type: "numeric",
            isNullable: true,
          },
          {
            name: "teacher_id",
            type: "uuid",
          },
          {
            name: "instruction",
            type: "varchar",
          },
          {
            name: "is_canceled",
            type: "boolean",
            default: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKTeacher",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["teacher_id"],
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("events");
  }
}
