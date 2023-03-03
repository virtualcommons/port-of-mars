import { MigrationInterface, QueryRunner } from "typeorm";

export class DropScheduledGameDate1677861842128 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "scheduled_game_date"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
