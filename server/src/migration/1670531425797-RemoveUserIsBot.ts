import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveUserIsBot1670531425797 implements MigrationInterface {
    name = 'RemoveUserIsBot1670531425797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isBot"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isBot" boolean NOT NULL DEFAULT false`);
    }

}
