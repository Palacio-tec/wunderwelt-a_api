import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddAddressFieldToUsers1638727679462 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(
      'users',
      [
        new TableColumn({
          name: 'street_name',
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: 'street_number',
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: 'zip_code',
          type: "varchar",
          isNullable: true,
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'zip_code');
    await queryRunner.dropColumn('users', 'street_number');
    await queryRunner.dropColumn('users', 'street_name');
  }

}
