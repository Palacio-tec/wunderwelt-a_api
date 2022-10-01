import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddBalanceFieldToHours1664045501554 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'hours',
            new TableColumn({
                name: 'balance',
                type: 'numeric',
                default: 0,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('hours', 'balance');
    }

}
