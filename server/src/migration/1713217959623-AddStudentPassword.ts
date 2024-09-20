import {MigrationInterface, QueryRunner} from "typeorm";

export class AddStudentPassword1713217959623 implements MigrationInterface {
    name = 'AddStudentPassword1713217959623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "password"`);
    }

}
