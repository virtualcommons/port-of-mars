import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPlayerIp1667243476058 implements MigrationInterface {
    name = 'AddPlayerIp1667243476058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" ADD "playerIp" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "playerIp"`);
    }

}
