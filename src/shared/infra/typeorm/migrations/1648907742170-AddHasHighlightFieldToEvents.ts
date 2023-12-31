import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddHasHighlightFieldToEvents1648907742170 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'events',
            new TableColumn({
                name: 'has_highlight',
                type: 'boolean',
                default: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('events', 'has_highlight');
    }

}
