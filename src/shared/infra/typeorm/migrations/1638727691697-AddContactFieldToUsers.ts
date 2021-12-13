import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddContactFieldToUsers1638727691697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(
      'users',
      [
        new TableColumn({
          name: 'area_code',
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: 'phone',
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: 'document_type',
          type: "varchar",
          isNullable: true,
        }),
        new TableColumn({
          name: 'document',
          type: "varchar",
          isNullable: true,
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'document');
    await queryRunner.dropColumn('users', 'document_type');
    await queryRunner.dropColumn('users', 'phone');
    await queryRunner.dropColumn('users', 'area_code');
  }

}
