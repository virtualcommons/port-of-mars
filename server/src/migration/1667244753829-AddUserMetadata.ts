import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserMetadata1667244753829 implements MigrationInterface {
    name = 'AddUserMetadata1667244753829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isSystemBot" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastPlayerIp" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastPlayerIp"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isSystemBot"`);
    }

}
