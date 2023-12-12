import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTournamentRoundSignupDates1702416761748 implements MigrationInterface {
    name = 'AddTournamentRoundSignupDates1702416761748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tournament_round_date_signups_tournament_round_invite" ("tournamentRoundDateId" integer NOT NULL, "tournamentRoundInviteId" integer NOT NULL, CONSTRAINT "PK_ea476e541957d189cb43e5566fb" PRIMARY KEY ("tournamentRoundDateId", "tournamentRoundInviteId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_179d52130a0f8722d72cfff0c5" ON "tournament_round_date_signups_tournament_round_invite" ("tournamentRoundDateId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d78ddb4862cff6e11870e81ced" ON "tournament_round_date_signups_tournament_round_invite" ("tournamentRoundInviteId") `);
        await queryRunner.query(`ALTER TABLE "tournament_round_date_signups_tournament_round_invite" ADD CONSTRAINT "FK_179d52130a0f8722d72cfff0c5d" FOREIGN KEY ("tournamentRoundDateId") REFERENCES "tournament_round_date"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tournament_round_date_signups_tournament_round_invite" ADD CONSTRAINT "FK_d78ddb4862cff6e11870e81ced8" FOREIGN KEY ("tournamentRoundInviteId") REFERENCES "tournament_round_invite"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_round_date_signups_tournament_round_invite" DROP CONSTRAINT "FK_d78ddb4862cff6e11870e81ced8"`);
        await queryRunner.query(`ALTER TABLE "tournament_round_date_signups_tournament_round_invite" DROP CONSTRAINT "FK_179d52130a0f8722d72cfff0c5d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d78ddb4862cff6e11870e81ced"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_179d52130a0f8722d72cfff0c5"`);
        await queryRunner.query(`DROP TABLE "tournament_round_date_signups_tournament_round_invite"`);
    }

}
