import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMetadataAddition1607117297405 implements MigrationInterface {
    name = 'UserMetadataAddition1607117297405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateCreated" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateCreated"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
    }

}
