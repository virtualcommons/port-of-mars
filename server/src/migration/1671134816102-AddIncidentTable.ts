import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIncidentTable1671134816102 implements MigrationInterface {
    name = 'AddIncidentTable1671134816102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."incident_action_enum" AS ENUM('mute', 'ban', 'none')`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","dateExpires","port_of_mars","public","incident"]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["port_of_mars","public","incident","GENERATED_COLUMN","dateExpires","case when \"muteLength\" is not null then \"dateCreated\" + interval '1 day' * \"muteLength\" else null end"]);
        await queryRunner.query(`CREATE TABLE "incident" ("id" SERIAL NOT NULL, "reportId" integer NOT NULL, "userId" integer NOT NULL, "adminId" integer NOT NULL, "action" "public"."incident_action_enum" NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "muteLength" integer, "dateExpires" TIMESTAMP GENERATED ALWAYS AS (case when "muteLength" is not null then "dateCreated" + interval '1 day' * "muteLength" else null end) STORED, "revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_5f90b28b0b8238d89ee8edcf96e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isMuted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "muteStrikes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_94f8e1966691747ffa4d8904be1" FOREIGN KEY ("reportId") REFERENCES "chat_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_c743cf0afa64e82b48fa7bf9f9b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_98e4f4b78d80d10d1c2a0f73283" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_98e4f4b78d80d10d1c2a0f73283"`);
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_c743cf0afa64e82b48fa7bf9f9b"`);
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_94f8e1966691747ffa4d8904be1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "muteStrikes"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isMuted"`);
        await queryRunner.query(`DROP TABLE "incident"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","dateExpires","port_of_mars","public","incident"]);
        await queryRunner.query(`DROP TYPE "public"."incident_action_enum"`);
    }

}
