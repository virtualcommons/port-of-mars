import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProlificStudy1724431857619 implements MigrationInterface {
    name = 'AddProlificStudy1724431857619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prolific_study_participant" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "prolificId" character varying NOT NULL, "studyId" integer NOT NULL, CONSTRAINT "REL_2a288d9abbe25b1817c68c37d7" UNIQUE ("userId"), CONSTRAINT "PK_30d57ab554a381a7d364a257513" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prolific_study" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying, "externalSurveyUrl" character varying, "studyId" character varying NOT NULL, "completionCode" character varying NOT NULL, CONSTRAINT "PK_3fcda1de03b25111b6584b63422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "prolificId"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "FK_2a288d9abbe25b1817c68c37d74" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" ADD CONSTRAINT "FK_c75960626fca5f5a1c3508ff98f" FOREIGN KEY ("studyId") REFERENCES "prolific_study"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "FK_c75960626fca5f5a1c3508ff98f"`);
        await queryRunner.query(`ALTER TABLE "prolific_study_participant" DROP CONSTRAINT "FK_2a288d9abbe25b1817c68c37d74"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "prolificId" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`DROP TABLE "prolific_study"`);
        await queryRunner.query(`DROP TABLE "prolific_study_participant"`);
    }

}
