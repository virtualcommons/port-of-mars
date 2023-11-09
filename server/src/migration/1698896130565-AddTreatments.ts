import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTreatments1698896130565 implements MigrationInterface {
    name = 'AddTreatments1698896130565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solo_high_score" DROP CONSTRAINT "FK_b7a5f0d7d5d816326e0b7daef84"`);
        await queryRunner.query(`CREATE TABLE "treatment" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "marsEventOverrides" jsonb, CONSTRAINT "PK_5ed256f72665dee35f8e47b416e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tournament_treatments_treatment" ("tournamentId" integer NOT NULL, "treatmentId" integer NOT NULL, CONSTRAINT "PK_51fb9e4c95d17614ddf43ff04a0" PRIMARY KEY ("tournamentId", "treatmentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_03fa7ee872d41e983bdda793fc" ON "tournament_treatments_treatment" ("tournamentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_38eaef09c6bb65d223f53e8d74" ON "tournament_treatments_treatment" ("treatmentId") `);
        await queryRunner.query(`ALTER TABLE "game" ADD "treatmentId" integer`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_c788ccf03f8452ec179982a4fbc" FOREIGN KEY ("treatmentId") REFERENCES "treatment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solo_high_score" ADD CONSTRAINT "FK_71c90c349c4faf3b1f071edaec3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_treatments_treatment" ADD CONSTRAINT "FK_03fa7ee872d41e983bdda793fc3" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tournament_treatments_treatment" ADD CONSTRAINT "FK_38eaef09c6bb65d223f53e8d74f" FOREIGN KEY ("treatmentId") REFERENCES "treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_treatments_treatment" DROP CONSTRAINT "FK_38eaef09c6bb65d223f53e8d74f"`);
        await queryRunner.query(`ALTER TABLE "tournament_treatments_treatment" DROP CONSTRAINT "FK_03fa7ee872d41e983bdda793fc3"`);
        await queryRunner.query(`ALTER TABLE "solo_high_score" DROP CONSTRAINT "FK_71c90c349c4faf3b1f071edaec3"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_c788ccf03f8452ec179982a4fbc"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "treatmentId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_38eaef09c6bb65d223f53e8d74"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03fa7ee872d41e983bdda793fc"`);
        await queryRunner.query(`DROP TABLE "tournament_treatments_treatment"`);
        await queryRunner.query(`DROP TABLE "treatment"`);
        await queryRunner.query(`ALTER TABLE "solo_high_score" ADD CONSTRAINT "FK_b7a5f0d7d5d816326e0b7daef84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
