import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1627902523297 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "email",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "username",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "inactivation_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "is_admin",
            type: "boolean",
            default: false,
          },
          {
            name: "is_teacher",
            type: "boolean",
            default: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
