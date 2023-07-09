import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddIsCompanyFieldToUsers1688149618102 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: "is_company",
                type: "boolean",
                default: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'is_company');
    }
}
