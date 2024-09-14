import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddBirthDateToUser1726322751725 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'birth_date',
                type: 'timestamp',
                isNullable: true
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'birth_date');
    }
}
