import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateFQA1670019758407 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: "fqas",
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
                  isNullable: true,
                },
                {
                  name: "embed_id",
                  type: "varchar",
                  isNullable: true,
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
        await queryRunner.dropTable("fqas");
    }

}
