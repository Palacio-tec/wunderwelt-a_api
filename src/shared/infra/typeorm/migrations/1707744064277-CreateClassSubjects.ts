import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateClassSubjects1707744064277 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "class_subjects",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "subject",
                        type: "varchar",
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "quantity",
                        type: "numeric",
                        default: 0
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
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("class_subjects")
    }

}
