import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTeacherPassword1712620270893 implements MigrationInterface {
    name = 'AddTeacherPassword1712620270893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teacher" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "classroom" ADD "descriptor" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom" DROP COLUMN "descriptor"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP COLUMN "password"`);
    }

}
