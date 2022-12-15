import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsMutedToUser1671044229913 implements MigrationInterface {
    name = 'AddIsMutedToUser1671044229913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isMuted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."incident_action_enum" RENAME TO "incident_action_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."incident_action_enum" AS ENUM('mute', 'ban', 'none')`);
        await queryRunner.query(`ALTER TABLE "incident" ALTER COLUMN "action" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "incident" ALTER COLUMN "action" TYPE "public"."incident_action_enum" USING "action"::"text"::"public"."incident_action_enum"`);
        await queryRunner.query(`DROP TYPE "public"."incident_action_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."incident_action_enum_old" AS ENUM('mute', 'ban')`);
        await queryRunner.query(`ALTER TABLE "incident" ALTER COLUMN "action" TYPE "public"."incident_action_enum_old" USING "action"::"text"::"public"."incident_action_enum_old"`);
        await queryRunner.query(`ALTER TABLE "incident" ALTER COLUMN "action" SET DEFAULT 'mute'`);
        await queryRunner.query(`DROP TYPE "public"."incident_action_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."incident_action_enum_old" RENAME TO "incident_action_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isMuted"`);
    }

}
