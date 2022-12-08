import {MigrationInterface, QueryRunner} from "typeorm";

export class AddChatReporting1669846502424 implements MigrationInterface {
    name = 'AddChatReporting1669846502424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_report" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "gameId" integer NOT NULL, "userId" integer NOT NULL, "message" jsonb NOT NULL, "resolved" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ebb459eb4da2a5061ff8d6e415e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isBanned" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "chat_report" ADD CONSTRAINT "FK_e2629ead95a4b6c06436b708505" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_report" ADD CONSTRAINT "FK_4bcf26a31b96ed582fe5492e5da" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_report" DROP CONSTRAINT "FK_4bcf26a31b96ed582fe5492e5da"`);
        await queryRunner.query(`ALTER TABLE "chat_report" DROP CONSTRAINT "FK_e2629ead95a4b6c06436b708505"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isBanned"`);
        await queryRunner.query(`DROP TABLE "chat_report"`);
    }

}
