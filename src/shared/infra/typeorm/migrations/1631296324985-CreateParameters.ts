import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateParameters1631296324985 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "parameters",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "reference",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "value",
            type: "varchar",
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("parameters");
  }
}
