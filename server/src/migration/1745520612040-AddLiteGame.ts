import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiteGame1745520612040 implements MigrationInterface {
    name = 'AddLiteGame1745520612040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."lite_game_treatment_thresholdinformation_enum" AS ENUM('unknown', 'range', 'known')`);
        await queryRunner.query(`CREATE TABLE "lite_game_treatment" ("id" SERIAL NOT NULL, "gameType" character varying NOT NULL DEFAULT 'freeplay', "isNumberOfRoundsKnown" boolean NOT NULL, "isEventDeckKnown" boolean NOT NULL, "thresholdInformation" "public"."lite_game_treatment_thresholdinformation_enum" NOT NULL, "isLowResSystemHealth" boolean NOT NULL DEFAULT false, "instructions" character varying, CONSTRAINT "PK_67ca97f88603d4b835d650581f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lite_player_decision" ("id" SERIAL NOT NULL, "systemHealthInvestment" integer NOT NULL, "pointsInvestment" integer NOT NULL, "roundId" integer NOT NULL, "playerId" integer NOT NULL, "initialPoints" integer NOT NULL, CONSTRAINT "PK_8e7489a1768b0c610fa8427a02d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."lite_player_vote_rolevote_enum" AS ENUM('Curator', 'Entrepreneur', 'Pioneer', 'Politician', 'Researcher')`);
        await queryRunner.query(`CREATE TABLE "lite_player_vote" ("id" SERIAL NOT NULL, "binaryVote" boolean NOT NULL, "roleVote" "public"."lite_player_vote_rolevote_enum" NOT NULL, "playerId" integer NOT NULL, "roundId" integer NOT NULL, "deckCardId" integer NOT NULL, CONSTRAINT "PK_965403e94b2f99f088a787aa7da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lite_game_round" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "roundNumber" integer NOT NULL, "initialSystemHealth" integer NOT NULL, "gameId" integer NOT NULL, CONSTRAINT "PK_86c22a476b05fe4507eb7ae0953" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."lite_mars_event_card_affectedrole_enum" AS ENUM('Curator', 'Entrepreneur', 'Pioneer', 'Politician', 'Researcher')`);
        await queryRunner.query(`CREATE TABLE "lite_mars_event_card" ("id" SERIAL NOT NULL, "gameType" character varying NOT NULL DEFAULT 'freeplay', "codeName" character varying NOT NULL, "displayName" character varying NOT NULL DEFAULT '', "flavorText" character varying NOT NULL DEFAULT '', "effect" character varying NOT NULL, "drawMin" integer NOT NULL DEFAULT '1', "drawMax" integer NOT NULL DEFAULT '1', "rollMin" integer NOT NULL DEFAULT '0', "rollMax" integer NOT NULL DEFAULT '0', "systemHealthMultiplier" integer NOT NULL DEFAULT '0', "pointsMultiplier" integer NOT NULL DEFAULT '0', "resourcesMultiplier" integer NOT NULL DEFAULT '0', "affectedRole" "public"."lite_mars_event_card_affectedrole_enum", "requiresVote" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2b0f0c02552aa1a62e8537e4061" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lite_mars_event_deck_card" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "cardId" integer NOT NULL, "effectText" character varying NOT NULL, "systemHealthEffect" integer NOT NULL, "resourcesEffect" integer NOT NULL, "pointsEffect" integer NOT NULL, "roundId" integer, "deckId" integer NOT NULL, CONSTRAINT "PK_c14eb09f117b3450cda7738e0c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lite_mars_event_deck" ("id" SERIAL NOT NULL, CONSTRAINT "PK_febbe5186ba1a602446561cd910" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."lite_game_status_enum" AS ENUM('incomplete', 'victory', 'defeat')`);
        await queryRunner.query(`CREATE TABLE "lite_game" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL DEFAULT 'freeplay', "status" "public"."lite_game_status_enum" NOT NULL, "maxRound" integer NOT NULL DEFAULT '0', "treatmentId" integer NOT NULL, "deckId" integer NOT NULL, "twoEventsThreshold" integer NOT NULL, "threeEventsThreshold" integer NOT NULL, CONSTRAINT "REL_0ec504756d2cf5967681d357dd" UNIQUE ("deckId"), CONSTRAINT "PK_5a87bb2b986736a399a5ce2cc08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."lite_player_role_enum" AS ENUM('Curator', 'Entrepreneur', 'Pioneer', 'Politician', 'Researcher')`);
        await queryRunner.query(`CREATE TABLE "lite_player" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "playerIp" character varying NOT NULL DEFAULT '', "points" integer, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "gameId" integer, "role" "public"."lite_player_role_enum" NOT NULL, CONSTRAINT "PK_dfd7f586dd89783d30aa09b3ea6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lite_high_score" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "pointsPerRound" double precision NOT NULL, "points" integer NOT NULL, "maxRound" integer NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "lastModified" TIMESTAMP NOT NULL DEFAULT now(), "playerId" integer, CONSTRAINT "PK_8500c3979b95b7c31a11c328487" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" ADD "prolificBaselinePlayerId" integer`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" ADD CONSTRAINT "UQ_bcf8a6eca870502cbed275d1a61" UNIQUE ("prolificBaselinePlayerId")`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" ADD "prolificVariablePlayerId" integer`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" ADD CONSTRAINT "UQ_7a337f47658feba6f1b637917cd" UNIQUE ("prolificVariablePlayerId")`);
        await queryRunner.query(`ALTER TABLE "lite_player_decision" ADD CONSTRAINT "FK_a5f93f46102504ff53e69b0f4e5" FOREIGN KEY ("roundId") REFERENCES "lite_game_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_player_decision" ADD CONSTRAINT "FK_ab70496d7d98e92dbcc05d556bd" FOREIGN KEY ("playerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD CONSTRAINT "FK_af22ab4e19c1be827203724ff2d" FOREIGN KEY ("playerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD CONSTRAINT "FK_9e944118f965706744fe4b71227" FOREIGN KEY ("roundId") REFERENCES "lite_game_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" ADD CONSTRAINT "FK_ff71958c963d4eab86fe1716f60" FOREIGN KEY ("deckCardId") REFERENCES "lite_mars_event_deck_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_game_round" ADD CONSTRAINT "FK_d92ae0783878043e18ed3d25324" FOREIGN KEY ("gameId") REFERENCES "lite_game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_mars_event_deck_card" ADD CONSTRAINT "FK_50153c668c311b45bec206f706f" FOREIGN KEY ("deckId") REFERENCES "lite_mars_event_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_mars_event_deck_card" ADD CONSTRAINT "FK_c8052b8e9b661e8ea467bc2c08a" FOREIGN KEY ("cardId") REFERENCES "lite_mars_event_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_mars_event_deck_card" ADD CONSTRAINT "FK_6e0814e556445e2558037e9b293" FOREIGN KEY ("roundId") REFERENCES "lite_game_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_game" ADD CONSTRAINT "FK_547f81a5e4467e932ca966599ab" FOREIGN KEY ("treatmentId") REFERENCES "lite_game_treatment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_game" ADD CONSTRAINT "FK_0ec504756d2cf5967681d357dd0" FOREIGN KEY ("deckId") REFERENCES "lite_mars_event_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_player" ADD CONSTRAINT "FK_77134f97988d0fa1a9c524e5c11" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_player" ADD CONSTRAINT "FK_222a7d59919f4608494268fe8d2" FOREIGN KEY ("gameId") REFERENCES "lite_game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_high_score" ADD CONSTRAINT "FK_45a3ba107d2873600043e4583af" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lite_high_score" ADD CONSTRAINT "FK_0868da8f0696e58d8c0cf2d422a" FOREIGN KEY ("playerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" ADD CONSTRAINT "FK_bcf8a6eca870502cbed275d1a61" FOREIGN KEY ("prolificBaselinePlayerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" ADD CONSTRAINT "FK_7a337f47658feba6f1b637917cd" FOREIGN KEY ("prolificVariablePlayerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" DROP CONSTRAINT "FK_7a337f47658feba6f1b637917cd"`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" DROP CONSTRAINT "FK_bcf8a6eca870502cbed275d1a61"`);
        await queryRunner.query(`ALTER TABLE "lite_high_score" DROP CONSTRAINT "FK_0868da8f0696e58d8c0cf2d422a"`);
        await queryRunner.query(`ALTER TABLE "lite_high_score" DROP CONSTRAINT "FK_45a3ba107d2873600043e4583af"`);
        await queryRunner.query(`ALTER TABLE "lite_player" DROP CONSTRAINT "FK_222a7d59919f4608494268fe8d2"`);
        await queryRunner.query(`ALTER TABLE "lite_player" DROP CONSTRAINT "FK_77134f97988d0fa1a9c524e5c11"`);
        await queryRunner.query(`ALTER TABLE "lite_game" DROP CONSTRAINT "FK_0ec504756d2cf5967681d357dd0"`);
        await queryRunner.query(`ALTER TABLE "lite_game" DROP CONSTRAINT "FK_547f81a5e4467e932ca966599ab"`);
        await queryRunner.query(`ALTER TABLE "lite_mars_event_deck_card" DROP CONSTRAINT "FK_6e0814e556445e2558037e9b293"`);
        await queryRunner.query(`ALTER TABLE "lite_mars_event_deck_card" DROP CONSTRAINT "FK_c8052b8e9b661e8ea467bc2c08a"`);
        await queryRunner.query(`ALTER TABLE "lite_mars_event_deck_card" DROP CONSTRAINT "FK_50153c668c311b45bec206f706f"`);
        await queryRunner.query(`ALTER TABLE "lite_game_round" DROP CONSTRAINT "FK_d92ae0783878043e18ed3d25324"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP CONSTRAINT "FK_ff71958c963d4eab86fe1716f60"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP CONSTRAINT "FK_9e944118f965706744fe4b71227"`);
        await queryRunner.query(`ALTER TABLE "lite_player_vote" DROP CONSTRAINT "FK_af22ab4e19c1be827203724ff2d"`);
        await queryRunner.query(`ALTER TABLE "lite_player_decision" DROP CONSTRAINT "FK_ab70496d7d98e92dbcc05d556bd"`);
        await queryRunner.query(`ALTER TABLE "lite_player_decision" DROP CONSTRAINT "FK_a5f93f46102504ff53e69b0f4e5"`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" DROP CONSTRAINT "UQ_7a337f47658feba6f1b637917cd"`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" DROP COLUMN "prolificVariablePlayerId"`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" DROP CONSTRAINT "UQ_bcf8a6eca870502cbed275d1a61"`);
        await queryRunner.query(`ALTER TABLE "prolific_multiplayer_study_participant" DROP COLUMN "prolificBaselinePlayerId"`);
        await queryRunner.query(`DROP TABLE "lite_high_score"`);
        await queryRunner.query(`DROP TABLE "lite_player"`);
        await queryRunner.query(`DROP TYPE "public"."lite_player_role_enum"`);
        await queryRunner.query(`DROP TABLE "lite_game"`);
        await queryRunner.query(`DROP TYPE "public"."lite_game_status_enum"`);
        await queryRunner.query(`DROP TABLE "lite_mars_event_deck"`);
        await queryRunner.query(`DROP TABLE "lite_mars_event_deck_card"`);
        await queryRunner.query(`DROP TABLE "lite_mars_event_card"`);
        await queryRunner.query(`DROP TYPE "public"."lite_mars_event_card_affectedrole_enum"`);
        await queryRunner.query(`DROP TABLE "lite_game_round"`);
        await queryRunner.query(`DROP TABLE "lite_player_vote"`);
        await queryRunner.query(`DROP TYPE "public"."lite_player_vote_rolevote_enum"`);
        await queryRunner.query(`DROP TABLE "lite_player_decision"`);
        await queryRunner.query(`DROP TABLE "lite_game_treatment"`);
        await queryRunner.query(`DROP TYPE "public"."lite_game_treatment_thresholdinformation_enum"`);
    }

}
