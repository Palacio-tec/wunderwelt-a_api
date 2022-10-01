import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AddPurchaseIdFieldToHours1664048970833 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'hours',
            new TableColumn({
                name: 'purchase_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        await queryRunner.createForeignKey(
            'hours',
            new TableForeignKey({
                name: 'FKPurchaseOrder',
                referencedTableName: "purchase_orders",
                referencedColumnNames: ["id"],
                columnNames: ["purchase_id"],
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('hours', 'FKPurchaseOrder')
        await queryRunner.dropColumn('hours', 'purchase_id');
    }

}
