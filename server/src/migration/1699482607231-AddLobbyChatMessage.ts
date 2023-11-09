import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLobbyChatMessage1699482607231 implements MigrationInterface {
    name = 'AddLobbyChatMessage1699482607231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lobby_chat_message" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "userId" integer NOT NULL, "message" character varying NOT NULL, "roomId" character varying NOT NULL, "lobbyType" character varying NOT NULL, CONSTRAINT "PK_4640a139c74b0d188cc5efdda33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lobby_chat_message" ADD CONSTRAINT "FK_96a0bc5d48c597dbd5ea6400feb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lobby_chat_message" DROP CONSTRAINT "FK_96a0bc5d48c597dbd5ea6400feb"`);
        await queryRunner.query(`DROP TABLE "lobby_chat_message"`);
    }

}
