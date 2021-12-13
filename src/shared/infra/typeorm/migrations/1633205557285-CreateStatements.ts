import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateStatements1633205557285 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "statements",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "user_id",
            type: "uuid",
          },
          {
            name: "amount",
            type: "numeric",
            default: 0,
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "type",
            type: "enum",
            enum: ["deposit", "withdraw"],
          },
          {
            name: "created_at",
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
    await queryRunner.dropTable("statements");
  }
}
