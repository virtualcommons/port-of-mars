import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProlificSologameStudy1726604412870 implements MigrationInterface {
    name = 'AddProlificSologameStudy1726604412870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prolific_study_participant" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "prolificId" character varying NOT NULL, "studyId" integer NOT NULL, "prolificBaselineTreatmentId" integer NOT NULL, "prolificVariableTreatmentId" integer NOT NULL, CONSTRAINT "REL_2a288d9abbe25b1817c68c37d7" UNIQUE ("userId"), CONSTRAINT "PK_30d57ab554a381a7d364a257513" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prolific_study" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying, "externalSurveyUrl" character varying, "studyId" character varying NOT NULL, "completionCode" character varying NOT NULL, CONSTRAINT "PK_3fcda1de03b25111b6584b63422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" ADD "gameType" character varying NOT NULL DEFAULT 'freeplay'`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" ADD "isLowResSystemHealth" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" ADD "instructions" character varying`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ADD "gameType" character varying NOT NULL DEFAULT 'freeplay'`);
        await queryRunner.query(`ALTER TABLE "solo_game" ADD "type" character varying NOT NULL DEFAULT 'freeplay'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "displayName" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "flavorText" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "drawMin" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "drawMax" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "rollMin" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "rollMax" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "systemHealthMultiplier" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "pointsMultiplier" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "resourcesMultiplier" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "FK_2a288d9abbe25b1817c68c37d74" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "FK_c75960626fca5f5a1c3508ff98f" FOREIGN KEY ("studyId") REFERENCES "prolific_study"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "FK_18b94ad2f7f5b4d7ead5e865864" FOREIGN KEY ("prolificBaselineTreatmentId") REFERENCES "solo_game_treatment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "FK_9fe3e4ae5dc5a2ae09e7a4f4bcc" FOREIGN KEY ("prolificVariableTreatmentId") REFERENCES "solo_game_treatment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "FK_9fe3e4ae5dc5a2ae09e7a4f4bcc"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "FK_18b94ad2f7f5b4d7ead5e865864"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "FK_c75960626fca5f5a1c3508ff98f"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "FK_2a288d9abbe25b1817c68c37d74"`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "resourcesMultiplier" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "pointsMultiplier" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "systemHealthMultiplier" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "rollMax" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "rollMin" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "drawMax" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "drawMin" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "flavorText" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "displayName" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_game" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" DROP COLUMN "gameType"`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" DROP COLUMN "instructions"`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" DROP COLUMN "isLowResSystemHealth"`);
        await queryRunner.query(`ALTER TABLE "solo_game_treatment" DROP COLUMN "gameType"`);
        await queryRunner.query(`DROP TABLE "prolific_study"`);
        await queryRunner.query(`DROP TABLE "prolific_study_participant"`);
    }

}
