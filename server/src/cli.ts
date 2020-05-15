import {program} from 'commander'
import {Connection, createConnection} from "typeorm";
import {getServices} from "@port-of-mars/server/services";
import {GameReplayer} from "@port-of-mars/server/services/replay";
import {DBPersister} from "@port-of-mars/server/services/persistence";
import {EnteredDefeatPhase, EnteredVictoryPhase} from "@port-of-mars/server/rooms/game/events";
import {Phase} from "@port-of-mars/shared/types";
import {getLogger} from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

async function withConnection(f: (conn: Connection) => Promise<void>) {
  const conn = await createConnection('default')
  try {
    await f(conn);
  } finally {
    await conn.close();
  }
}

async function finalize(gameId: number) {
  await withConnection(async (conn) => {
      const em = conn.createEntityManager();
      const s = getServices(em);
      const events = await s.game.findEventsByGameId(gameId);
      const replayer = new GameReplayer(events);
      const gameState = replayer.endState;
      const persister = new DBPersister();
      const gameEvents = [];
      console.log(`Phase: ${Phase[gameState.phase]}`);
      if (![Phase.defeat, Phase.victory].includes(gameState.phase)) {
        if (gameState.upkeep <= 0) {
          console.log('game needs a entered defeat phase event. adding finalization event.')
          gameEvents.push(new EnteredDefeatPhase(gameState.playerScores));
        } else if (gameState.round >= gameState.maxRound) {
          console.log('game needs a entered victory phase event. adding finalization event.')
          gameEvents.push(new EnteredVictoryPhase(gameState.playerScores));
        } else {
          console.error('game was not completed. refusing to add finalize event.')
          process.exit(1);
        }
        await persister.persist(gameEvents, {gameId, dateCreated: new Date(), timeRemaining: gameState.timeRemaining})
        await persister.sync();
        await persister.finalize(gameId);
      }
    }
  );
}

program
  .addCommand(
    program.createCommand('tournament')
      .description('tournamament subcommands')
      .addCommand(
        program
          .createCommand('round')
          .description('round subcommands')
          .addCommand(
            program
              .createCommand('create')
              .requiredOption('--tournament <String>', 'id of tournament')
              .description('create a tournament round')
              .action(() => {
                console.log('tournament round create...')
              })))
      .addCommand(
        program
          .createCommand('create')
          .requiredOption('--name', 'name of tournament')
          .description('create a tournament')
          .action(() => {
            console.log('tournament create...')
          })
      ))
  .addCommand(
    program.createCommand('game')
      .description('game subcommands')
      .addCommand(
        program
          .createCommand('finalize')
          .description('finalize a game that wasn\'t finalized properly')
          .requiredOption('--gameId [gameId]', 'id of game')
          .action(async (cmd) => {
            await finalize(parseInt(cmd.gameId))
          })
      )
  );

async function main(argv: Array<string>): Promise<void> {
  await program.parseAsync(argv);
}

main(process.argv);