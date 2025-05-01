import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMultiplayerParticipantStatusInfo1746123176974 implements MigrationInterface {
    name = 'AddMultiplayerParticipantStatusInfo1746123176974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" ADD "roomId" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" ADD "abandonedGame" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" DROP COLUMN "abandonedGame"`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" DROP COLUMN "roomId"`);
    }

}
