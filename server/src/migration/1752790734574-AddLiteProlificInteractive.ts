import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiteProlificInteractive1752790734574 implements MigrationInterface {
  name = "AddLiteProlificInteractive1752790734574";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lite_chat_message" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "playerId" integer NOT NULL, "message" character varying NOT NULL, "gameId" integer NOT NULL, "round" integer NOT NULL, CONSTRAINT "PK_f31675cb7a773d75f5100660ff5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "prolific_multiplayer_study" ADD "gameType" character varying NOT NULL DEFAULT 'prolificBaseline'`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_chat_message" ADD CONSTRAINT "FK_3e57003d074eb2cf18f58011601" FOREIGN KEY ("playerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_chat_message" ADD CONSTRAINT "FK_a02ac0d70aa61c4e322385b6e55" FOREIGN KEY ("gameId") REFERENCES "lite_game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lite_chat_message" DROP CONSTRAINT "FK_a02ac0d70aa61c4e322385b6e55"`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_chat_message" DROP CONSTRAINT "FK_3e57003d074eb2cf18f58011601"`
    );
    await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study" DROP COLUMN "gameType"`);
    await queryRunner.query(`DROP TABLE "lite_chat_message"`);
  }
}
