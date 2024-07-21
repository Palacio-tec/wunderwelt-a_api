import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddIsActiveOriginalValueOriginalAmountIntoProductTable1721491217280 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(
            'products',
            [
                new TableColumn({
                    name: "is_active",
                    type: "boolean",
                    default: false,
                }),
                new TableColumn({
                    name: "original_value",
                    type: "numeric",
                    isNullable: true,
                }),
                new TableColumn({
                    name: "original_amount",
                    type: "numeric",
                    isNullable: true,
                })
            ]
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('products', 'original_amount');
        await queryRunner.dropColumn('products', 'original_value');
        await queryRunner.dropColumn('products', 'is_active');
    }
}
