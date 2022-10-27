import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPassportIdToUser1666903440370 implements MigrationInterface {
    name = 'AddPassportIdToUser1666903440370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "passportId" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passportId"`);
    }

}
