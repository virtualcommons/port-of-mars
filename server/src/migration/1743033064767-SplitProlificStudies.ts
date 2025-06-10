import { MigrationInterface, QueryRunner } from "typeorm";

export class SplitProlificStudies1743033064767 implements MigrationInterface {
  name = "SplitProlificStudies1743033064767";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("prolific_study_participant", "prolific_solo_study_participant");
    await queryRunner.renameTable("prolific_study", "prolific_solo_study");
    await queryRunner.query(
      `CREATE TABLE "prolific_multiplayer_study_participant" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "prolificId" character varying NOT NULL, "studyId" integer NOT NULL, CONSTRAINT "REL_585fdda54140ea2c58e68b876a" UNIQUE ("userId"), CONSTRAINT "PK_0f165c682dde4bc6bfbc237adb1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "prolific_multiplayer_study" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying, "externalSurveyUrl" character varying, "studyId" character varying NOT NULL, "completionCode" character varying NOT NULL, CONSTRAINT "PK_40a1dbc0ef24d77bd7df673a8a4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "prolific_multiplayer_study_participant" ADD CONSTRAINT "FK_585fdda54140ea2c58e68b876a7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "prolific_multiplayer_study_participant" ADD CONSTRAINT "FK_200e29a5b78384674911246e041" FOREIGN KEY ("studyId") REFERENCES "prolific_multiplayer_study"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("prolific_solo_study_participant", "prolific_study_participant");
    await queryRunner.renameTable("prolific_solo_study", "prolific_study");
    await queryRunner.query(
      `ALTER TABLE "prolific_multiplayer_study_participant" DROP CONSTRAINT "FK_200e29a5b78384674911246e041"`
    );
    await queryRunner.query(
      `ALTER TABLE "prolific_multiplayer_study_participant" DROP CONSTRAINT "FK_585fdda54140ea2c58e68b876a7"`
    );
    await queryRunner.query(`DROP TABLE "prolific_multiplayer_study"`);
    await queryRunner.query(`DROP TABLE "prolific_multiplayer_study_participant"`);
  }
}
