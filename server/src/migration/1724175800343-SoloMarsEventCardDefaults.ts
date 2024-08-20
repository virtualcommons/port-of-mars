import { MigrationInterface, QueryRunner } from "typeorm";

export class SoloMarsEventCardDefaults1724175800343 implements MigrationInterface {
    name = 'SoloMarsEventCardDefaults1724175800343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "displayName" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "flavorText" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "drawMin" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "drawMax" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "rollMin" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "rollMax" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "systemHealthMultiplier" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "pointsMultiplier" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "resourcesMultiplier" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "resourcesMultiplier" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "pointsMultiplier" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "systemHealthMultiplier" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "rollMax" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "rollMin" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "drawMax" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "drawMin" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "flavorText" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "solo_mars_event_card" ALTER COLUMN "displayName" DROP DEFAULT`);
    }

}
