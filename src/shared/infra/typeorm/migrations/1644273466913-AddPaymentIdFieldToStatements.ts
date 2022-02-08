import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPaymentIdFieldToStatements1644273466913 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'statements',
      new TableColumn({
        name: 'payment_id',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('statements', 'payment_id');
  }
}
