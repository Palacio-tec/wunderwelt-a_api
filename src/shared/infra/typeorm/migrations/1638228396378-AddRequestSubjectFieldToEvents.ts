import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddRequestSubjectFieldToEvents1638228396378 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'events',
      new TableColumn({
        name: 'request_subject',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('events', 'request_subject');
  }

}
