import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddCreditFieldToEvents1638017958551 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'events',
      new TableColumn({
        name: 'credit',
        type: "numeric",
        default: 0,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('events', 'credit');
  }
}
