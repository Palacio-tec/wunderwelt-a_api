import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddReceiveNewsletterAndReceiveEmailToUser1684280793038 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(
      'users',
      [
        new TableColumn({
          name: 'receive_newsletter',
          type: 'boolean',
          default: true
        }),
        new TableColumn({
          name: 'receive_email',
          type: 'boolean',
          default: true
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'receive_email');
    await queryRunner.dropColumn('users', 'receive_newsletter');
  }
}
