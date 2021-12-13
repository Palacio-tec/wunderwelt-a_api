import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePurchaseOrders1638727133182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "purchase_orders",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
            },
            {
              name: "payment_id",
              type: "varchar",
            },
            {
              name: "status",
              type: "varchar",
            },
            {
              name: "status_detail",
              type: "varchar",
            },
            {
              name: "product_id",
              type: "uuid",
            },
            {
              name: "value",
              type: "numeric",
            },
            {
              name: "credit",
              type: "numeric",
            },
            {
              name: "payer_id",
              type: "uuid",
              isNullable: true,
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
              name: "FKUser",
              referencedTableName: "users",
              referencedColumnNames: ["id"],
              columnNames: ["payer_id"],
              onUpdate: "CASCADE",
              onDelete: "RESTRICT",
            },
            {
              name: "FKProduct",
              referencedTableName: "products",
              referencedColumnNames: ["id"],
              columnNames: ["product_id"],
              onUpdate: "CASCADE",
              onDelete: "RESTRICT",
            },
          ],
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("purchase_orders");
    }

}
