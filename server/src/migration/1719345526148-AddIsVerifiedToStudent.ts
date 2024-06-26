import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsVerifiedToStudent1719345526148 implements MigrationInterface {
    name = 'AddIsVerifiedToStudent1719345526148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_b35463776b4a11a3df3c30d920a"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "REL_b35463776b4a11a3df3c30d920"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "REL_b35463776b4a11a3df3c30d920" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_b35463776b4a11a3df3c30d920a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
