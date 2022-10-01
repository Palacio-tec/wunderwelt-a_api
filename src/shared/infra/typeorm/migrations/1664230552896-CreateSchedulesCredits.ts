import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSchedulesCredits1664230552896 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "schedules_credits",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "schedule_id",
            type: "uuid",
          },
          {
            name: "credit_id",
            type: "uuid",
          },
          {
            name: "amount_credit",
            type: "numeric",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKSchedule",
            referencedTableName: "schedules",
            referencedColumnNames: ["id"],
            columnNames: ["schedule_id"],
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
          {
            name: "FKCredit",
            referencedTableName: "hours",
            referencedColumnNames: ["id"],
            columnNames: ["credit_id"],
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("schedules_credits");
  }
}
