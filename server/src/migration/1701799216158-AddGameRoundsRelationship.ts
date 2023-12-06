import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGameRoundsRelationship1701799216158 implements MigrationInterface {
  name = "AddGameRoundsRelationship1701799216158";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // remove corrupted round entries (where gameId is 0)
    await queryRunner.query(`DELETE FROM "solo_game_round" WHERE "gameId" = 0`);
    await queryRunner.query(
      `ALTER TABLE "solo_game_round" ADD CONSTRAINT "FK_4561cd9a73086f238bc0433e0d2" FOREIGN KEY ("gameId") REFERENCES "solo_game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "solo_game_round" DROP CONSTRAINT "FK_4561cd9a73086f238bc0433e0d2"`
    );
  }
}
