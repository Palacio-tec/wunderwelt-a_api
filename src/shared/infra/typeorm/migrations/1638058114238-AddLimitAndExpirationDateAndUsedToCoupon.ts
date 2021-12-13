import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddLimitAndExpirationDateAndUsedToCoupon1638058114238 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(
      'coupons',
      [
        new TableColumn({
          name: 'limit',
          type: "numeric",
          default: 0,
        }),
        new TableColumn({
          name: "expiration_date",
          type: "timestamp",
          default: "now()"
        }),
        new TableColumn({
          name: "used",
          type: "numeric",
          default: "0"
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('coupons', 'used');
    await queryRunner.dropColumn('coupons', 'expiration_date');
    await queryRunner.dropColumn('coupons', 'limit');
  }

}
