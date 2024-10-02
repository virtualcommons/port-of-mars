import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProlificParticipantPlayer1727891252710 implements MigrationInterface {
    name = 'AddProlificParticipantPlayer1727891252710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD "prolificBaselinePlayerId" integer`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "UQ_da2b1f49f29eef7941ab06eca11" UNIQUE ("prolificBaselinePlayerId")`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD "prolificVariablePlayerId" integer`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "UQ_b5a15c60ff91e4b754305c64137" UNIQUE ("prolificVariablePlayerId")`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "FK_da2b1f49f29eef7941ab06eca11" FOREIGN KEY ("prolificBaselinePlayerId") REFERENCES "solo_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "FK_b5a15c60ff91e4b754305c64137" FOREIGN KEY ("prolificVariablePlayerId") REFERENCES "solo_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "FK_b5a15c60ff91e4b754305c64137"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "FK_da2b1f49f29eef7941ab06eca11"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "UQ_b5a15c60ff91e4b754305c64137"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP COLUMN "prolificVariablePlayerId"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "UQ_da2b1f49f29eef7941ab06eca11"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP COLUMN "prolificBaselinePlayerId"`);
    }

}
