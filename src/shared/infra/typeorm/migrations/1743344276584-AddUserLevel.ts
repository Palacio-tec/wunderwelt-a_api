import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AddUserLevel1743344276584 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: "level_id",
                type: "uuid",
                isNullable: true
            }),
        );
        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                name: "FKLevel",
                referencedTableName: "levels",
                referencedColumnNames: ["id"],
                columnNames: ["level_id"],
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('users', 'FKLevel')
        await queryRunner.dropColumn('users', 'level');
    }

}
