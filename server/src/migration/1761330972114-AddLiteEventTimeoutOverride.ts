import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiteEventTimeoutOverride1761330972114 implements MigrationInterface {
    name = 'AddLiteEventTimeoutOverride1761330972114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lite_mars_event_card" ADD "eventTimeoutOverride" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lite_mars_event_card" DROP COLUMN "eventTimeoutOverride"`);
    }

}
