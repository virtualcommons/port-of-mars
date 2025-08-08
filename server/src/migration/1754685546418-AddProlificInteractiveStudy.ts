import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProlificInteractiveStudy1754685546418 implements MigrationInterface {
  name = "AddProlificInteractiveStudy1754685546418";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prolific_interactive_study_participant" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "prolificId" character varying NOT NULL, "studyId" integer NOT NULL, "roomId" character varying NOT NULL DEFAULT '', "abandonedGame" boolean NOT NULL DEFAULT false, "interactivePlayerId" integer, CONSTRAINT "REL_2bce3bd6bdf9dccb3d55c7b1dd" UNIQUE ("userId"), CONSTRAINT "REL_1f838a9be6b8563c057ff9fcac" UNIQUE ("interactivePlayerId"), CONSTRAINT "PK_9d3edd4a44720d81d93cbe75abe" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "prolific_interactive_study" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying, "externalSurveyUrl" character varying, "studyId" character varying NOT NULL, "completionCode" character varying NOT NULL, "gameType" character varying NOT NULL DEFAULT 'prolificInteractive', CONSTRAINT "PK_59b4deb56893f1d71f77c171eef" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "prolific_interactive_study_participant" ADD CONSTRAINT "FK_2bce3bd6bdf9dccb3d55c7b1dd3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "prolific_interactive_study_participant" ADD CONSTRAINT "FK_37c35dd2760cf3f06f36be2e0cc" FOREIGN KEY ("studyId") REFERENCES "prolific_interactive_study"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "prolific_interactive_study_participant" ADD CONSTRAINT "FK_1f838a9be6b8563c057ff9fcace" FOREIGN KEY ("interactivePlayerId") REFERENCES "lite_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prolific_interactive_study_participant" DROP CONSTRAINT "FK_1f838a9be6b8563c057ff9fcace"`
    );
    await queryRunner.query(
      `ALTER TABLE "prolific_interactive_study_participant" DROP CONSTRAINT "FK_37c35dd2760cf3f06f36be2e0cc"`
    );
    await queryRunner.query(
      `ALTER TABLE "prolific_interactive_study_participant" DROP CONSTRAINT "FK_2bce3bd6bdf9dccb3d55c7b1dd3"`
    );
    await queryRunner.query(`DROP TABLE "prolific_interactive_study"`);
    await queryRunner.query(`DROP TABLE "prolific_interactive_study_participant"`);
  }
}
