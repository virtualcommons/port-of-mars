import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMuteStrikesToUser1671053213936 implements MigrationInterface {
    name = 'AddMuteStrikesToUser1671053213936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "muteStrikes" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "muteStrikes"`);
    }

}
