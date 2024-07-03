import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGameClassroomId1719960742206 implements MigrationInterface {
    name = 'AddGameClassroomId1719960742206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "classroomId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "classroomId"`);
    }

}
