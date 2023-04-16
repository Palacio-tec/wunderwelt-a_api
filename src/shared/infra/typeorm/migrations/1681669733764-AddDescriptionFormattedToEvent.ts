import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddDescriptionFormattedToEvent1681669733764 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'events',
            new TableColumn({
                name: "description_formatted",
                type: "varchar",
                isNullable: true
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('events', 'description_formatted');
    }

}
