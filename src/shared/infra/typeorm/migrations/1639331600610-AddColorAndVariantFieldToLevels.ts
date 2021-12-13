import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddColorAndVariantFieldToLevels1639331600610 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(
      'levels',
      [
        new TableColumn({
          name: 'color',
          type: 'varchar',
          default: "'blue'"
        }),
        new TableColumn({
          name: 'variant',
          type: 'varchar',
          default: "'outline'"
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('levels', 'variant');
    await queryRunner.dropColumn('levels', 'color');
  }

}
