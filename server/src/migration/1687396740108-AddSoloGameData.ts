import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSoloGameData1687396740108 implements MigrationInterface {
    name = 'AddSoloGameData1687396740108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."solo_game_treatment_thresholdinformation_enum" AS ENUM('unknown', 'range', 'known')`);
        await queryRunner.query(`CREATE TABLE "solo_game_treatment" ("id" SERIAL NOT NULL, "isKnownNumberOfRounds" boolean NOT NULL, "isEventDeckKnown" boolean NOT NULL, "thresholdInformation" "public"."solo_game_treatment_thresholdinformation_enum" NOT NULL, CONSTRAINT "PK_61a365004e22a4d84b35711f4c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "solo_player_decision" ("id" SERIAL NOT NULL, "systemHealthInvestment" integer NOT NULL, "pointsInvestment" integer NOT NULL, CONSTRAINT "PK_a39283302b3ed8728f66b8108fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "solo_game_round" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "gameId" integer NOT NULL, "roundNumber" integer NOT NULL, "decisionId" integer NOT NULL, CONSTRAINT "REL_a31e55e614589c1806a4b96f15" UNIQUE ("decisionId"), CONSTRAINT "PK_410930ce91d0fb7658ac8e5203d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "solo_mars_event_card" ("id" SERIAL NOT NULL, "codeName" character varying NOT NULL, "displayName" character varying NOT NULL, "flavorText" character varying NOT NULL, "effect" character varying NOT NULL, "drawMin" integer NOT NULL, "drawMax" integer NOT NULL, "rollMin" integer NOT NULL, "rollMax" integer NOT NULL, "systemHealthMultiplier" integer NOT NULL, "pointsMultiplier" integer NOT NULL, "resourcesMultiplier" integer NOT NULL, CONSTRAINT "PK_7947d532c97b8ca371fb460d01c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "solo_mars_event_deck_card" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "deckId" integer NOT NULL, "cardId" integer NOT NULL, "effectText" character varying NOT NULL, "systemHealthEffect" integer NOT NULL, "resourcesEffect" integer NOT NULL, "pointsEffect" integer NOT NULL, "roundId" integer, CONSTRAINT "PK_39035f7fd267d19f4863843efeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "solo_mars_event_deck" ("id" SERIAL NOT NULL, CONSTRAINT "PK_875bc3785d3916d7e5c5807d3a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."solo_game_status_enum" AS ENUM('incomplete', 'victory', 'defeat')`);
        await queryRunner.query(`CREATE TABLE "solo_game" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "playerId" integer NOT NULL, "treatmentId" integer NOT NULL, "deckId" integer NOT NULL, "status" "public"."solo_game_status_enum" NOT NULL, CONSTRAINT "REL_ee276d60507980ddead8f08c80" UNIQUE ("playerId"), CONSTRAINT "REL_39a6a51dc8dbc70626d59fe06d" UNIQUE ("deckId"), CONSTRAINT "PK_a941170fd23d55a87d4e49cca7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "solo_player" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "playerIp" character varying NOT NULL DEFAULT '', "gameId" integer, "points" integer, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b0ee07ab2bf9b16ad83c4f921c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "solo_game_round" ADD CONSTRAINT "FK_a31e55e614589c1806a4b96f158" FOREIGN KEY ("decisionId") REFERENCES "solo_player_decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_deck_card" ADD CONSTRAINT "FK_a48822e171d01382a35c0d087fb" FOREIGN KEY ("deckId") REFERENCES "solo_mars_event_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_deck_card" ADD CONSTRAINT "FK_794e3e38b173d64eec1f2962996" FOREIGN KEY ("cardId") REFERENCES "solo_mars_event_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_deck_card" ADD CONSTRAINT "FK_732e7ef62231a3b1f8a692b9ca9" FOREIGN KEY ("roundId") REFERENCES "solo_game_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solo_game" ADD CONSTRAINT "FK_ee276d60507980ddead8f08c80a" FOREIGN KEY ("playerId") REFERENCES "solo_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solo_game" ADD CONSTRAINT "FK_7ba902b4f916952de522fbf7d0e" FOREIGN KEY ("treatmentId") REFERENCES "solo_game_treatment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solo_game" ADD CONSTRAINT "FK_39a6a51dc8dbc70626d59fe06db" FOREIGN KEY ("deckId") REFERENCES "solo_mars_event_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solo_player" ADD CONSTRAINT "FK_f3655aa944db2032d6d9453c5c7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solo_player" DROP CONSTRAINT "FK_f3655aa944db2032d6d9453c5c7"`);
        await queryRunner.query(`ALTER TABLE "solo_game" DROP CONSTRAINT "FK_39a6a51dc8dbc70626d59fe06db"`);
        await queryRunner.query(`ALTER TABLE "solo_game" DROP CONSTRAINT "FK_7ba902b4f916952de522fbf7d0e"`);
        await queryRunner.query(`ALTER TABLE "solo_game" DROP CONSTRAINT "FK_ee276d60507980ddead8f08c80a"`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_deck_card" DROP CONSTRAINT "FK_732e7ef62231a3b1f8a692b9ca9"`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_deck_card" DROP CONSTRAINT "FK_794e3e38b173d64eec1f2962996"`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_deck_card" DROP CONSTRAINT "FK_a48822e171d01382a35c0d087fb"`);
        await queryRunner.query(`ALTER TABLE "solo_game_round" DROP CONSTRAINT "FK_a31e55e614589c1806a4b96f158"`);
        await queryRunner.query(`DROP TABLE "solo_player"`);
        await queryRunner.query(`DROP TABLE "solo_game"`);
        await queryRunner.query(`DROP TYPE "public"."solo_game_status_enum"`);
        await queryRunner.query(`DROP TABLE "solo_mars_event_deck"`);
        await queryRunner.query(`DROP TABLE "solo_mars_event_deck_card"`);
        await queryRunner.query(`DROP TABLE "solo_mars_event_card"`);
        await queryRunner.query(`DROP TABLE "solo_game_round"`);
        await queryRunner.query(`DROP TABLE "solo_player_decision"`);
        await queryRunner.query(`DROP TABLE "solo_game_treatment"`);
        await queryRunner.query(`DROP TYPE "public"."solo_game_treatment_thresholdinformation_enum"`);
    }

}
