import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddModalityFieldToEvent1678485508494 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'events',
            new TableColumn({
                name: "modality",
                type: "enum",
                enum: ["face_to_face", "remote"],
                isNullable: true
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('events', 'modality');
    }

}
