import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreateCompanyMembers1688156794837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: "company_members",
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
                  name: "company_id",
                  type: "uuid",
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
                {
                    name: "FKCompany",
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    columnNames: ["company_id"],
                    onUpdate: "CASCADE",
                    onDelete: "RESTRICT",
                },
              ],
            })
        );

        await queryRunner.createIndex(
            "company_members",
            new TableIndex({
                name: "IDX_COMPANY_MEMBERS_USER_ID",
                columnNames: ["user_id"]
            })
        )

        await queryRunner.createIndex(
            "company_members",
            new TableIndex({
                name: "IDX_COMPANY_MEMBERS_COMPANY_ID",
                columnNames: ["company_id"]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("company_members", "IDX_COMPANY_MEMBERS_COMPANY_ID")
        await queryRunner.dropIndex("company_members", "IDX_COMPANY_MEMBERS_USER_ID")
        await queryRunner.dropTable("company_members");
    }

}
