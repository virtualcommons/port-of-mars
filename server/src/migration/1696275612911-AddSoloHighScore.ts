import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSoloHighScore1696275612911 implements MigrationInterface {
    name = 'AddSoloHighScore1696275612911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "solo_high_score" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "pointsPerRound" double precision NOT NULL, "points" integer NOT NULL, "maxRound" integer NOT NULL, "gameId" integer, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "lastModified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_52d621b5047f8eb9a6861975622" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "solo_game" ALTER COLUMN "maxRound" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "solo_high_score" ADD CONSTRAINT "FK_b7a5f0d7d5d816326e0b7daef84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solo_high_score" DROP CONSTRAINT "FK_b7a5f0d7d5d816326e0b7daef84"`);
        await queryRunner.query(`ALTER TABLE "solo_game" ALTER COLUMN "maxRound" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "solo_high_score"`);
    }

}
