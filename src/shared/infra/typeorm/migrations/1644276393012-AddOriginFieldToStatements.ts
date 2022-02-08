import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddOriginFieldToStatements1644276393012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'statements',
      new TableColumn({
        name: 'origin',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('statements', 'origin');
  }
}
