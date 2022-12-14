import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeLobbyCloseToGenerated1670976633211 implements MigrationInterface {
    name = 'ChangeLobbyCloseToGenerated1670976633211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduled_game_date" DROP COLUMN "lobbyCloseDate"`);
        await queryRunner.query(`ALTER TABLE "scheduled_game_date" ADD "lobbyCloseDate" TIMESTAMP GENERATED ALWAYS AS ("date" + interval '1 minute' * "minutesOpenAfter") STORED`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","lobbyCloseDate","port_of_mars","public","scheduled_game_date"]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["port_of_mars","public","scheduled_game_date","GENERATED_COLUMN","lobbyCloseDate","\"date\" + interval '1 minute' * \"minutesOpenAfter\""]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","lobbyCloseDate","port_of_mars","public","scheduled_game_date"]);
        await queryRunner.query(`ALTER TABLE "scheduled_game_date" DROP COLUMN "lobbyCloseDate"`);
        await queryRunner.query(`ALTER TABLE "scheduled_game_date" ADD "lobbyCloseDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
