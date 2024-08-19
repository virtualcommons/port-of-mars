import { MigrationInterface, QueryRunner } from "typeorm";

export class SoloGameProlific1724101985703 implements MigrationInterface {
    name = 'SoloGameProlific1724101985703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "classroomId"`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" ADD "gameType" character varying NOT NULL DEFAULT 'freeplay'`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" ADD "isLowResSystemHealth" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ADD "gameType" character varying NOT NULL DEFAULT 'freeplay'`);
        await queryRunner.query(`ALTER TABLE "solo_game" ADD "type" character varying NOT NULL DEFAULT 'freeplay'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "prolificId" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "prolificId"`);
        await queryRunner.query(`ALTER TABLE "solo_game" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" DROP COLUMN "gameType"`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" DROP COLUMN "isLowResSystemHealth"`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" DROP COLUMN "gameType"`);
        await queryRunner.query(`ALTER TABLE "game" ADD "classroomId" integer`);
    }

}
