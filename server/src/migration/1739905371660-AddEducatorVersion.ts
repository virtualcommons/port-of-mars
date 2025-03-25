import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEducatorVersion1739905371660 implements MigrationInterface {
    name = 'AddEducatorVersion1739905371660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teacher" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "password" character varying NOT NULL, CONSTRAINT "REL_4f596730e16ee49d9b081b5d8e" UNIQUE ("userId"), CONSTRAINT "PK_2f807294148612a9751dacf1026" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classroom" ("id" SERIAL NOT NULL, "teacherId" integer NOT NULL, "authToken" character varying NOT NULL, "descriptor" character varying NOT NULL, CONSTRAINT "UQ_5001c4e5dbc1507f8ad6578f3e1" UNIQUE ("authToken"), CONSTRAINT "PK_729f896c8b7b96ddf10c341e6ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "classroomId" integer NOT NULL, "rejoinCode" character varying NOT NULL, CONSTRAINT "UQ_77adce5802e7f39e1fb53885c8f" UNIQUE ("rejoinCode"), CONSTRAINT "REL_b35463776b4a11a3df3c30d920" UNIQUE ("userId"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "game" ADD "classroomId" integer`);
        await queryRunner.query(`ALTER TABLE "teacher" ADD CONSTRAINT "FK_4f596730e16ee49d9b081b5d8e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classroom" ADD CONSTRAINT "FK_2b3c1fa62762d7d0e828c139130" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_b35463776b4a11a3df3c30d920a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_426224f5597213259b1d58fc0f4" FOREIGN KEY ("classroomId") REFERENCES "classroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_426224f5597213259b1d58fc0f4"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_b35463776b4a11a3df3c30d920a"`);
        await queryRunner.query(`ALTER TABLE "classroom" DROP CONSTRAINT "FK_2b3c1fa62762d7d0e828c139130"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP CONSTRAINT "FK_4f596730e16ee49d9b081b5d8e5"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "classroomId"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "classroom"`);
        await queryRunner.query(`DROP TABLE "teacher"`);
    }

}
