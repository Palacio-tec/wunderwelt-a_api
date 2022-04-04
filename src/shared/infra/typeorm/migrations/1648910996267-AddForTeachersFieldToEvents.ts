import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddForTeachersFieldToEvents1648910996267 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'events',
            new TableColumn({
                name: 'for_teachers',
                type: 'boolean',
                default: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('events', 'for_teachers');
    }

}
