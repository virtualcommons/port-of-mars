import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { SoloGame, SoloGameRound } from "@port-of-mars/server/entity";
import { SoloGameState } from "@port-of-mars/server/rooms/sologame/state";

const WEAR_AND_TEAR = SoloGameState.STATIC_PARAMS.systemHealthWear;
const MAX_SYSTEM_HEALTH = SoloGameState.STATIC_PARAMS.systemHealthMax;
const STARTING_POINTS = SoloGameState.STATIC_PARAMS.points;

export class ComputeSoloRoundInitialValues1701805620516 implements MigrationInterface {
  name = "ComputeSoloRoundInitialValues1701805620516";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // add (temporarily nullable) columns to SoloGameRound
    await queryRunner.addColumns("solo_game_round", [
      new TableColumn({
        name: "initialSystemHealth",
        type: "int",
        isNullable: true,
      }),
      new TableColumn({
        name: "initialPoints",
        type: "int",
        isNullable: true,
      }),
    ]);

    await this.deleteSuperfluousRounds(queryRunner);
    await this.computeMissingInitialValues(queryRunner);

    // remove nullable constraint from columns
    await queryRunner.changeColumn(
      "solo_game_round",
      "initialSystemHealth",
      new TableColumn({
        name: "initialSystemHealth",
        type: "int",
        isNullable: false,
      })
    );
    await queryRunner.changeColumn(
      "solo_game_round",
      "initialPoints",
      new TableColumn({
        name: "initialPoints",
        type: "int",
        isNullable: false,
      })
    );
  }

  private async computeMissingInitialValues(queryRunner: QueryRunner): Promise<void> {
    // fetch all existing games with rounds, cards, decisions
    const games = await queryRunner.manager.find(SoloGame, {
      relations: {
        rounds: {
          cards: true,
          decision: true,
        },
      },
    });
    for (const game of games) {
      let initialSystemHealth = MAX_SYSTEM_HEALTH;
      let initialPoints = STARTING_POINTS;
      game.rounds.sort((a, b) => a.roundNumber - b.roundNumber);
      for (const round of game.rounds) {
        // simulate a round
        // apply wear/tear -> save initial values -> apply cards -> apply decision -> repeat
        initialSystemHealth = Math.max(0, initialSystemHealth - WEAR_AND_TEAR);
        await queryRunner.manager.update(SoloGameRound, round.id, {
          initialSystemHealth,
          initialPoints,
        });
        for (const card of round.cards) {
          initialSystemHealth = Math.min(
            MAX_SYSTEM_HEALTH,
            initialSystemHealth + card.systemHealthEffect
          );
          initialPoints = Math.max(0, initialPoints + card.pointsEffect);
        }
        if (round.decision) {
          initialSystemHealth = Math.min(
            MAX_SYSTEM_HEALTH,
            initialSystemHealth + round.decision.systemHealthInvestment
          );
          initialPoints = Math.max(0, initialPoints + round.decision.pointsInvestment);
        }
      }
    }
  }

  private async deleteSuperfluousRounds(queryRunner: QueryRunner): Promise<void> {
    // remove duplicate round records that were created by a bug in the game logic
    // we keep the last created round since this is the one that is referenced by the
    // deck cards
    await queryRunner.query(`
        DELETE FROM "solo_game_round"
        WHERE "id" NOT IN (
            SELECT MAX("id")
            FROM "solo_game_round"
            GROUP BY "gameId", "roundNumber"
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solo_game_round" DROP COLUMN "initialPoints"`);
    await queryRunner.query(`ALTER TABLE "solo_game_round" DROP COLUMN "initialSystemHealth"`);
  }
}
