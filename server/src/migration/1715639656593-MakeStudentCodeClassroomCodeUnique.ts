import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeStudentCodeClassroomCodeUnique1715639656593 implements MigrationInterface {
    name = 'MakeStudentCodeClassroomCodeUnique1715639656593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" RENAME COLUMN "password" TO "rejoinCode"`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "UQ_77adce5802e7f39e1fb53885c8f" UNIQUE ("rejoinCode")`);
        await queryRunner.query(`ALTER TABLE "classroom" ADD CONSTRAINT "UQ_5001c4e5dbc1507f8ad6578f3e1" UNIQUE ("authToken")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom" DROP CONSTRAINT "UQ_5001c4e5dbc1507f8ad6578f3e1"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "UQ_77adce5802e7f39e1fb53885c8f"`);
        await queryRunner.query(`ALTER TABLE "student" RENAME COLUMN "rejoinCode" TO "password"`);
    }

}
