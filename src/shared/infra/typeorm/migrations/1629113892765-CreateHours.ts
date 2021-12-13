import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateHours1629113892765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "hours",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "amount",
            type: "numeric",
          },
          {
            name: "user_id",
            type: "uuid",
          },
          {
            name: "expiration_date",
            type: "timestamp",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
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
    await queryRunner.dropTable("hours");
  }
}
