import {MigrationInterface, QueryRunner} from "typeorm";

export class AddModerationActionTable1671156473904 implements MigrationInterface {
    name = 'AddModerationActionTable1671156473904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."moderation_action_action_enum" AS ENUM('mute', 'ban', 'none')`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","dateMuteExpires","port_of_mars","public","moderation_action"]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["port_of_mars","public","moderation_action","GENERATED_COLUMN","dateMuteExpires","case when \"daysMuted\" is not null then \"dateCreated\" + interval '1 day' * \"daysMuted\" else null end"]);
        await queryRunner.query(`CREATE TABLE "moderation_action" ("id" SERIAL NOT NULL, "reportId" integer NOT NULL, "userId" integer NOT NULL, "adminId" integer NOT NULL, "action" "public"."moderation_action_action_enum" NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "daysMuted" integer, "dateMuteExpires" TIMESTAMP GENERATED ALWAYS AS (case when "daysMuted" is not null then "dateCreated" + interval '1 day' * "daysMuted" else null end) STORED, "revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_152a7fb29b5a2bfc5fa43a96806" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isMuted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "muteStrikes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "scheduled_game_date" DROP COLUMN "lobbyCloseDate"`);
        await queryRunner.query(`ALTER TABLE "scheduled_game_date" ADD "lobbyCloseDate" TIMESTAMP GENERATED ALWAYS AS ("date" + interval '1 minute' * "minutesOpenAfter") STORED`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","lobbyCloseDate","port_of_mars","public","scheduled_game_date"]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["port_of_mars","public","scheduled_game_date","GENERATED_COLUMN","lobbyCloseDate","\"date\" + interval '1 minute' * \"minutesOpenAfter\""]);
        await queryRunner.query(`ALTER TABLE "moderation_action" ADD CONSTRAINT "FK_64cb2162b81e4f4c4d778f1ed2d" FOREIGN KEY ("reportId") REFERENCES "chat_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "moderation_action" ADD CONSTRAINT "FK_41198e6096b6a55b1f5c5549beb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "moderation_action" ADD CONSTRAINT "FK_b63b644db636b8abd2d4cfaf54d" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "moderation_action" DROP CONSTRAINT "FK_b63b644db636b8abd2d4cfaf54d"`);
        await queryRunner.query(`ALTER TABLE "moderation_action" DROP CONSTRAINT "FK_41198e6096b6a55b1f5c5549beb"`);
        await queryRunner.query(`ALTER TABLE "moderation_action" DROP CONSTRAINT "FK_64cb2162b81e4f4c4d778f1ed2d"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","lobbyCloseDate","port_of_mars","public","scheduled_game_date"]);
        await queryRunner.query(`ALTER TABLE "scheduled_game_date" DROP COLUMN "lobbyCloseDate"`);
        await queryRunner.query(`ALTER TABLE "scheduled_game_date" ADD "lobbyCloseDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "muteStrikes"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isMuted"`);
        await queryRunner.query(`DROP TABLE "moderation_action"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","dateMuteExpires","port_of_mars","public","moderation_action"]);
        await queryRunner.query(`DROP TYPE "public"."moderation_action_action_enum"`);
    }

}
