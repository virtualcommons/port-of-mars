import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGameType1698183026092 implements MigrationInterface {
  name = "AddGameType1698183026092";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" ADD "type" character varying NOT NULL DEFAULT 'freeplay'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "type"`);
  }
}
