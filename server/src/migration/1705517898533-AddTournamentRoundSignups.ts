import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTournamentRoundSignups1705517898533 implements MigrationInterface {
    name = 'AddTournamentRoundSignups1705517898533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tournament_round_signup" ("tournamentRoundInviteId" integer NOT NULL, "tournamentRoundDateId" integer NOT NULL, CONSTRAINT "PK_9ca713344f84fdcb0a29418ab48" PRIMARY KEY ("tournamentRoundInviteId", "tournamentRoundDateId"))`);
        await queryRunner.query(`ALTER TABLE "tournament_round_signup" ADD CONSTRAINT "FK_e23420d741d9efa72888f948d8e" FOREIGN KEY ("tournamentRoundInviteId") REFERENCES "tournament_round_invite"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_round_signup" ADD CONSTRAINT "FK_7a74b3434f7b9fd1e2dd345128c" FOREIGN KEY ("tournamentRoundDateId") REFERENCES "tournament_round_date"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_round_signup" DROP CONSTRAINT "FK_7a74b3434f7b9fd1e2dd345128c"`);
        await queryRunner.query(`ALTER TABLE "tournament_round_signup" DROP CONSTRAINT "FK_e23420d741d9efa72888f948d8e"`);
        await queryRunner.query(`DROP TABLE "tournament_round_signup"`);
    }

}
