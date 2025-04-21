import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddOurStudentToUsers1745257801244 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: "our_student",
                type: "boolean",
                isNullable: true
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'our_student')
    }

}
