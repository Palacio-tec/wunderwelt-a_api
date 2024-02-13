import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class AddIndexToManyTables1707749825281 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            'events',
            new TableIndex({
                name: 'start_date',
                columnNames: ['start_date']
            })
        )
        await queryRunner.createIndex(
            'events',
            new TableIndex({
                name: 'is_canceled',
                columnNames: ['is_canceled']
            })
        )
        await queryRunner.query(
            `CREATE INDEX lower_title ON events (LOWER(title));`
        );
        await queryRunner.query(
            `CREATE INDEX lower_description ON events (LOWER(description));`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX lower_description`)
        await queryRunner.query(`DROP INDEX lower_title`)
        await queryRunner.dropIndex('events', 'is_canceled')
        await queryRunner.dropIndex('events', 'start_date')
    }

}
