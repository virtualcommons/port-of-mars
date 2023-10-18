import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoloGameMaxRound1693945293530 implements MigrationInterface {
  name = "AddSoloGameMaxRound1693945293530";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solo_game" ADD "maxRound" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(
      `ALTER TABLE "solo_game" ALTER COLUMN "twoEventsThreshold" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "solo_game" ALTER COLUMN "threeEventsThreshold" DROP DEFAULT`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "solo_game" ALTER COLUMN "threeEventsThreshold" SET DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "solo_game" ALTER COLUMN "twoEventsThreshold" SET DEFAULT '0'`
    );
    await queryRunner.query(`ALTER TABLE "solo_game" DROP COLUMN "maxRound"`);
  }
}
