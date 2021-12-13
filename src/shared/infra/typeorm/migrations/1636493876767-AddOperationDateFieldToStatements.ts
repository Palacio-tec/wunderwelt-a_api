import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddOperationDateFieldToStatements1636493876767 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'statements',
      new TableColumn({
        name: 'operation_date',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('statements', 'operation_date');
  }

}
