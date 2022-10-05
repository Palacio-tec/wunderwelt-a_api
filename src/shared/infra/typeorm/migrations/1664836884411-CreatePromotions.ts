import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePromotions1664836884411 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: "promotions",
              columns: [
                {
                  name: "id",
                  type: "uuid",
                  isPrimary: true,
                },
                {
                  name: "message",
                  type: "varchar",
                },
                {
                  name: "coupon_id",
                  type: "uuid",
                },
                {
                  name: "promotion_date",
                  type: "timestamp",
                },
                {
                  name: "user_id",
                  type: "uuid",
                },
                {
                  name: "created_at",
                  type: "timestamp",
                  default: "now()",
                },
                {
                  name: "updated_at",
                  type: "timestamp",
                  default: "now()",
                },
              ],
              foreignKeys: [
                {
                  name: "FKCoupon",
                  referencedTableName: "coupons",
                  referencedColumnNames: ["id"],
                  columnNames: ["coupon_id"],
                  onUpdate: "CASCADE",
                  onDelete: "RESTRICT",
                },
              ],
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("promotions");
    }

}
