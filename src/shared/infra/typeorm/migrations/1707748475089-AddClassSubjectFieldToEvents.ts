import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AddClassSubjectFieldToEvents1707748475089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'events',
            new TableColumn({
                name: "class_subject_id",
                type: "uuid",
                isNullable: true,
            })
        )

        await queryRunner.createForeignKey(
            "events",
            new TableForeignKey({
                name: "FKClassSubject",
                columnNames: ["class_subject_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "class_subjects",
                onDelete: "RESTRICT"
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("events", "FKClassSubject");
        await queryRunner.dropColumn('events', 'class_subject_id')
    }

}
