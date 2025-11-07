import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiteProlificInteractive1755194163286 implements MigrationInterface {
    name = 'AddLiteProlificInteractive1755194163286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP CONSTRAINT "FK_9e944118f965706744fe4b71227"`);
        await queryRunner.query(`CREATE TABLE "lite_player_vote_effect" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "deckCardId" integer NOT NULL, "playerId" integer NOT NULL, "pointsChange" integer NOT NULL DEFAULT '0', "resourcesChange" integer NOT NULL DEFAULT '0', "systemHealthChange" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_8981d8cf8e1e34165319fbe471f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lite_chat_message" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "playerId" integer NOT NULL, "message" character varying NOT NULL, "gameId" integer NOT NULL, "round" integer NOT NULL, CONSTRAINT "PK_f31675cb7a773d75f5100660ff5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prolific_interactive_study_participant" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "prolificId" character varying NOT NULL, "studyId" integer NOT NULL, "roomId" character varying NOT NULL DEFAULT '', "abandonedGame" boolean NOT NULL DEFAULT false, "interactivePlayerId" integer, CONSTRAINT "REL_2bce3bd6bdf9dccb3d55c7b1dd" UNIQUE ("userId"), CONSTRAINT "REL_1f838a9be6b8563c057ff9fcac" UNIQUE ("interactivePlayerId"), CONSTRAINT "PK_9d3edd4a44720d81d93cbe75abe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prolific_interactive_study" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying, "externalSurveyUrl" character varying, "studyId" character varying NOT NULL, "completionCode" character varying NOT NULL, "gameType" character varying NOT NULL DEFAULT 'prolificInteractive', CONSTRAINT "PK_59b4deb56893f1d71f77c171eef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "roundId"`);
        await queryRunner.query(`ALTER TABLE "lite_game_treatment" ADD "numLifeAsUsualCardsOverride" integer`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD "dateCreated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD "isDefaultTimeoutVote" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD "binaryVoteInterpretation" character varying`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD "voteStep" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "prolific_solo_study" ADD "gameType" character varying NOT NULL DEFAULT 'prolificBaseline'`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study" ADD "gameType" character varying NOT NULL DEFAULT 'prolificBaseline'`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ALTER COLUMN "binaryVote" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "roleVote"`);
        await queryRunner.query(`DROP TYPE "public"."lite_player_vote_rolevote_enum"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD "roleVote" character varying`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote_effect" ADD CONSTRAINT "FK_b6e645acf6d4057fad37272be97" FOREIGN KEY ("deckCardId") REFERENCES "lite_mars_event_deck_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote_effect" ADD CONSTRAINT "FK_edf9c978e90e6996c2d7c772f12" FOREIGN KEY ("playerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_chat_message" ADD CONSTRAINT "FK_3e57003d074eb2cf18f58011601" FOREIGN KEY ("playerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_chat_message" ADD CONSTRAINT "FK_a02ac0d70aa61c4e322385b6e55" FOREIGN KEY ("gameId") REFERENCES "lite_game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_interactive_study_participant" ADD CONSTRAINT "FK_2bce3bd6bdf9dccb3d55c7b1dd3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_interactive_study_participant" ADD CONSTRAINT "FK_37c35dd2760cf3f06f36be2e0cc" FOREIGN KEY ("studyId") REFERENCES "prolific_interactive_study"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_interactive_study_participant" ADD CONSTRAINT "FK_1f838a9be6b8563c057ff9fcace" FOREIGN KEY ("interactivePlayerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prolific_interactive_study_participant" DROP CONSTRAINT "FK_1f838a9be6b8563c057ff9fcace"`);
        await queryRunner.query(`ALTER TABLE "prolific_interactive_study_participant" DROP CONSTRAINT "FK_37c35dd2760cf3f06f36be2e0cc"`);
        await queryRunner.query(`ALTER TABLE "prolific_interactive_study_participant" DROP CONSTRAINT "FK_2bce3bd6bdf9dccb3d55c7b1dd3"`);
        await queryRunner.query(`ALTER TABLE "lite_chat_message" DROP CONSTRAINT "FK_a02ac0d70aa61c4e322385b6e55"`);
        await queryRunner.query(`ALTER TABLE "lite_chat_message" DROP CONSTRAINT "FK_3e57003d074eb2cf18f58011601"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote_effect" DROP CONSTRAINT "FK_edf9c978e90e6996c2d7c772f12"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote_effect" DROP CONSTRAINT "FK_b6e645acf6d4057fad37272be97"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "roleVote"`);
        await queryRunner.query(`CREATE TYPE "public"."lite_player_vote_rolevote_enum" AS ENUM('Curator', 'Entrepreneur', 'Pioneer', 'Politician', 'Researcher')`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD "roleVote" "public"."lite_player_vote_rolevote_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ALTER COLUMN "binaryVote" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study" DROP COLUMN "gameType"`);
        await queryRunner.query(`ALTER TABLE "prolific_solo_study" DROP COLUMN "gameType"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "voteStep"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "binaryVoteInterpretation"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "isDefaultTimeoutVote"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP COLUMN "dateCreated"`);
        await queryRunner.query(`ALTER TABLE "lite_game_treatment" DROP COLUMN "numLifeAsUsualCardsOverride"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD "roundId" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "prolific_interactive_study"`);
        await queryRunner.query(`DROP TABLE "prolific_interactive_study_participant"`);
        await queryRunner.query(`DROP TABLE "lite_chat_message"`);
        await queryRunner.query(`DROP TABLE "lite_player_vote_effect"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD CONSTRAINT "FK_9e944118f965706744fe4b71227" FOREIGN KEY ("roundId") REFERENCES "lite_game_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
