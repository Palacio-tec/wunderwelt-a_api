import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddSubjectFieldToSchedules1638228568870 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'schedules',
      new TableColumn({
        name: 'subject',
        type: "varchar",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('schedules', 'subject');
  }

}
