import {MigrationInterface, QueryRunner} from "typeorm";

export class addSchedule1666037205957 implements MigrationInterface {
    name = 'addSchedule1666037205957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "schedule"`);
    }

}
