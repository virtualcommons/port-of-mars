import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiteGameVoting1753297901376 implements MigrationInterface {
  name = "AddLiteGameVoting1753297901376";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" DROP CONSTRAINT "FK_9e944118f965706744fe4b71227"`
    );
    await queryRunner.query(
      `CREATE TABLE "lite_player_vote_effect" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "deckCardId" integer NOT NULL, "playerId" integer NOT NULL, "pointsChange" integer NOT NULL DEFAULT '0', "resourcesChange" integer NOT NULL DEFAULT '0', "systemHealthChange" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_8981d8cf8e1e34165319fbe471f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "roundId"`);
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" ADD "dateCreated" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" ADD "isDefaultTimeoutVote" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" ADD "binaryVoteInterpretation" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" ADD "voteStep" integer NOT NULL DEFAULT '1'`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" ALTER COLUMN "binaryVote" DROP NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "roleVote"`);
    await queryRunner.query(`DROP TYPE "public"."lite_player_vote_rolevote_enum"`);
    await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD "roleVote" character varying`);
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote_effect" ADD CONSTRAINT "FK_b6e645acf6d4057fad37272be97" FOREIGN KEY ("deckCardId") REFERENCES "lite_mars_event_deck_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote_effect" ADD CONSTRAINT "FK_edf9c978e90e6996c2d7c772f12" FOREIGN KEY ("playerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote_effect" DROP CONSTRAINT "FK_edf9c978e90e6996c2d7c772f12"`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote_effect" DROP CONSTRAINT "FK_b6e645acf6d4057fad37272be97"`
    );
    await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "roleVote"`);
    await queryRunner.query(
      `CREATE TYPE "public"."lite_player_vote_rolevote_enum" AS ENUM('Curator', 'Entrepreneur', 'Pioneer', 'Politician', 'Researcher')`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" ADD "roleVote" "public"."lite_player_vote_rolevote_enum" NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" ALTER COLUMN "binaryVote" SET NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "voteStep"`);
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" DROP COLUMN "binaryVoteInterpretation"`
    );
    await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "isDefaultTimeoutVote"`);
    await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "dateCreated"`);
    await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD "roundId" integer NOT NULL`);
    await queryRunner.query(`DROP TABLE "lite_player_vote_effect"`);
    await queryRunner.query(
      `ALTER TABLE "lite_player_vote" ADD CONSTRAINT "FK_9e944118f965706744fe4b71227" FOREIGN KEY ("roundId") REFERENCES "lite_game_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
