import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddCreditFieldToUsers1664235293382 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'credit',
                type: 'numeric',
                default: 0,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'credit');
    }

}
