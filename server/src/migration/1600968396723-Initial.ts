import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1600968396723 implements MigrationInterface {
    name = 'Initial1600968396723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game_event" ("id" SERIAL NOT NULL, "gameId" integer NOT NULL, "type" character varying NOT NULL, "payload" jsonb NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "timeRemaining" integer NOT NULL, CONSTRAINT "PK_d979b8a4d47b02b8f87322f33e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tournament" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "active" boolean NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_39c996e461f5fe152d4811f9e54" UNIQUE ("name"), CONSTRAINT "PK_449f912ba2b62be003f0c22e767" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tournament_round_date" ("id" SERIAL NOT NULL, "tournamentRoundId" integer NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_608a88e29bcf26ffee33446e25f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tournament_round" ("id" SERIAL NOT NULL, "roundNumber" integer NOT NULL, "numberOfGameRounds" integer NOT NULL DEFAULT 12, "tournamentId" integer NOT NULL, "introSurveyUrl" character varying, "exitSurveyUrl" character varying, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40931a39f30039b3de581bf4806" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tournament_round_invite" ("id" SERIAL NOT NULL, "tournamentRoundId" integer NOT NULL, "userId" integer NOT NULL, "hasParticipated" boolean NOT NULL DEFAULT false, "hasCompletedIntroSurvey" boolean NOT NULL DEFAULT false, "hasCompletedExitSurvey" boolean NOT NULL DEFAULT false, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4604294bf59d5e001f0361f2a33" UNIQUE ("userId", "tournamentRoundId"), CONSTRAINT "PK_921655be23744634aaadf3568a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying, "passedQuiz" boolean NOT NULL DEFAULT false, "registrationToken" uuid NOT NULL DEFAULT uuid_generate_v4(), "participantId" uuid NOT NULL DEFAULT uuid_generate_v4(), "isVerified" boolean NOT NULL DEFAULT false, "dateConsented" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "player_role_enum" AS ENUM('Curator', 'Entrepreneur', 'Pioneer', 'Politician', 'Researcher')`);
        await queryRunner.query(`CREATE TABLE "player" ("id" SERIAL NOT NULL, "role" "player_role_enum" NOT NULL, "userId" integer NOT NULL, "gameId" integer NOT NULL, "points" integer, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "roomId" character varying NOT NULL, "buildId" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateFinalized" TIMESTAMP, "tournamentRoundId" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'incomplete', "winnerId" integer, CONSTRAINT "REL_cd57acb58d1147c23da5cd09ca" UNIQUE ("winnerId"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_response" ("id" SERIAL NOT NULL, "questionId" integer NOT NULL, "submissionId" integer NOT NULL, "answer" integer NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b6c14a10d1d808f247ad89f4685" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_submission" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "quizId" integer NOT NULL, CONSTRAINT "PK_af730e984e8f6f25b5667a5d7be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "quizId" integer NOT NULL, "question" character varying NOT NULL, "options" jsonb NOT NULL, "correctAnswer" integer NOT NULL, "tutorialElementId" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "game_event" ADD CONSTRAINT "FK_71fa66873a3ea8dabfa3b267432" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_round_date" ADD CONSTRAINT "FK_0d1fb1e55339e433e212fbd7212" FOREIGN KEY ("tournamentRoundId") REFERENCES "tournament_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_round" ADD CONSTRAINT "FK_427f88a9c9475d0c248c0321736" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_round_invite" ADD CONSTRAINT "FK_190cbb0d8573db49e599c973d5f" FOREIGN KEY ("tournamentRoundId") REFERENCES "tournament_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_round_invite" ADD CONSTRAINT "FK_10661028f07a7359fbbb45e4345" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_7687919bf054bf262c669d3ae21" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_c02c037ca5f7f6d22d82c4e18fa" FOREIGN KEY ("tournamentRoundId") REFERENCES "tournament_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_response" ADD CONSTRAINT "FK_91f0c1f6c501e01525c9db6df29" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_response" ADD CONSTRAINT "FK_1bb7171618902f1d1935002f979" FOREIGN KEY ("submissionId") REFERENCES "quiz_submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" ADD CONSTRAINT "FK_611bef6102c491c49be42432c17" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" ADD CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" DROP CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7"`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" DROP CONSTRAINT "FK_611bef6102c491c49be42432c17"`);
        await queryRunner.query(`ALTER TABLE "question_response" DROP CONSTRAINT "FK_1bb7171618902f1d1935002f979"`);
        await queryRunner.query(`ALTER TABLE "question_response" DROP CONSTRAINT "FK_91f0c1f6c501e01525c9db6df29"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_c02c037ca5f7f6d22d82c4e18fa"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_7687919bf054bf262c669d3ae21"`);
        await queryRunner.query(`ALTER TABLE "tournament_round_invite" DROP CONSTRAINT "FK_10661028f07a7359fbbb45e4345"`);
        await queryRunner.query(`ALTER TABLE "tournament_round_invite" DROP CONSTRAINT "FK_190cbb0d8573db49e599c973d5f"`);
        await queryRunner.query(`ALTER TABLE "tournament_round" DROP CONSTRAINT "FK_427f88a9c9475d0c248c0321736"`);
        await queryRunner.query(`ALTER TABLE "tournament_round_date" DROP CONSTRAINT "FK_0d1fb1e55339e433e212fbd7212"`);
        await queryRunner.query(`ALTER TABLE "game_event" DROP CONSTRAINT "FK_71fa66873a3ea8dabfa3b267432"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "quiz"`);
        await queryRunner.query(`DROP TABLE "quiz_submission"`);
        await queryRunner.query(`DROP TABLE "question_response"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TYPE "player_role_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "tournament_round_invite"`);
        await queryRunner.query(`DROP TABLE "tournament_round"`);
        await queryRunner.query(`DROP TABLE "tournament_round_date"`);
        await queryRunner.query(`DROP TABLE "tournament"`);
        await queryRunner.query(`DROP TABLE "game_event"`);
    }

}
