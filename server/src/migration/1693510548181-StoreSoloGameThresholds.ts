import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreSoloGameThresholds1693510548181 implements MigrationInterface {
  name = "StoreSoloGameThresholds1693510548181";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "solo_game" ADD "twoEventsThreshold" integer NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "solo_game" ADD "threeEventsThreshold" integer NOT NULL DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solo_game" DROP COLUMN "threeEventsThreshold"`);
    await queryRunner.query(`ALTER TABLE "solo_game" DROP COLUMN "twoEventsThreshold"`);
  }
}
