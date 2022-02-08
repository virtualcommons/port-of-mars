import {MigrationInterface, QueryRunner} from "typeorm";

export class addChampionshipRound1644350406427 implements MigrationInterface {
    name = 'addChampionshipRound1644350406427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_round" ADD "championship" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_round" DROP COLUMN "championship"`);
    }

}
