import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserIsBot1613509726805 implements MigrationInterface {
    name = 'AddUserIsBot1613509726805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isBot" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isBot"`);
    }

}
