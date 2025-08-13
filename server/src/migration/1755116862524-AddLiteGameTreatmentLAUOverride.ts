import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiteGameTreatmentLAUOverride1755116862524 implements MigrationInterface {
    name = 'AddLiteGameTreatmentLAUOverride1755116862524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lite_game_treatment" ADD "numLifeAsUsualCardsOverride" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lite_game_treatment" DROP COLUMN "numLifeAsUsualCardsOverride"`);
    }

}
