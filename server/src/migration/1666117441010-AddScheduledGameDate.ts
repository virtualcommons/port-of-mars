import {MigrationInterface, QueryRunner} from "typeorm";

export class AddScheduledGameDate1666117441010 implements MigrationInterface {
    name = 'AddScheduledGameDate1666117441010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduled_game_date" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "autoCreated" boolean NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b1d158a7357ad9244be2bc8e72e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "scheduled_game_date"`);
    }

}
