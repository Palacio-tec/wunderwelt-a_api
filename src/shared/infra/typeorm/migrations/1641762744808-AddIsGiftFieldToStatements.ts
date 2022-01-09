import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddIsGiftFieldToStatements1641762744808 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'statements',
      new TableColumn({
        name: 'is_gift',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('statements', 'is_gift');
  }
}
