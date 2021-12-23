import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddMinimumNumberOfStudentsFieldToEvents1640040795821 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'events',
      new TableColumn({
        name: 'minimum_number_of_students',
        type: 'numeric',
        default: 0,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('events', 'minimum_number_of_students');
  }

}
