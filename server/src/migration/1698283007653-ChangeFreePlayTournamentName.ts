import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFreePlayTournamentName1698283007653 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE tournament SET name = 'freeplay' WHERE name = 'openbeta';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE tournament SET name = 'openbeta' WHERE name = 'freeplay';`);
  }
}
