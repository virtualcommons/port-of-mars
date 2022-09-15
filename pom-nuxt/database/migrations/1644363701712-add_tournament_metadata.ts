import {MigrationInterface, QueryRunner} from "typeorm";

export class addTournamentMetadata1644363701712 implements MigrationInterface {
    name = 'addTournamentMetadata1644363701712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" ADD "minNumberOfGameRounds" integer NOT NULL DEFAULT '8'`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "maxNumberOfGameRounds" integer NOT NULL DEFAULT '12'`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "tournament_round" ADD "announcement" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_round" DROP COLUMN "announcement"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "maxNumberOfGameRounds"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "minNumberOfGameRounds"`);
    }

}
