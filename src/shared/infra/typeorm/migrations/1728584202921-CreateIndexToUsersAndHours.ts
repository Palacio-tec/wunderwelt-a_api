import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class CreateIndexToUsersAndHours1728584202921 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            "hours",
            new TableIndex({
                name: "IDX_HOURS_USER_ID_EXPIRATION_DATE",
                columnNames: ["user_id", "expiration_date"]
            })
        )

        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "IDX_USERS_ID_INACTIVATION_DATE_RECEIVE_EMAIL",
                columnNames: ["id", "inactivation_date", "receive_email"]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("users", "IDX_USERS_ID_INACTIVATION_DATE_RECEIVE_EMAIL")
        await queryRunner.dropIndex("hours", "IDX_HOURS_USER_ID_EXPIRATION_DATE")
    }

}
