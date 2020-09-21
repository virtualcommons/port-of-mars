import {program} from 'commander'
import {Connection, createConnection, EntityManager} from "typeorm";
import {getServices} from "@port-of-mars/server/services";
import {
  AccomplishmentSummarizer,
  GameEventSummarizer,
  GameReplayer, MarsEventSummarizer,
  PlayerInvestmentSummarizer,
  VictoryPointSummarizer
} from "@port-of-mars/server/services/replay";
import {DBPersister} from "@port-of-mars/server/services/persistence";
import {EnteredDefeatPhase, EnteredVictoryPhase} from "@port-of-mars/server/rooms/game/events";
import {Phase} from "@port-of-mars/shared/types";
import {getLogger} from "@port-of-mars/server/settings";
import {GameEvent, Tournament, TournamentRound} from "@port-of-mars/server/entity";
import * as ops from "typeorm/index";
import _ from "lodash";

const logger = getLogger(__filename);

async function withConnection<T>(f: (em: EntityManager) => Promise<T>): Promise<void> {
  const conn = await createConnection('default');
  const em = conn.createEntityManager();
  try {
    await f(em);
  } finally {
    await conn.close();
  }
}

async function exportData(em: EntityManager, opts: {ids?: Array<number>, dateCreatedMin?: Date}): Promise<void> {
  let eventQuery = await em.getRepository(GameEvent)
    .createQueryBuilder("ge")
    .leftJoinAndSelect("ge.game", "g")
    .orderBy('ge.id', 'ASC');
  if (opts.ids && opts.ids.length > 0) {
    eventQuery = eventQuery.where('"gameId" in (:...ids)', {ids: opts.ids});
  }
  if (opts.dateCreatedMin) {
    if (opts.ids && opts.ids.length > 0) {
      eventQuery = eventQuery.andWhere('g."dateCreated" > (:dateCreatedMin)', {dateCreatedMin: opts.dateCreatedMin});
    } else {
      eventQuery = eventQuery.where('g."dateCreated" > (:dateCreatedMin)', {dateCreatedMin: opts.dateCreatedMin});
    }
  }
  console.log(eventQuery.getSql());
  const events = await eventQuery.getMany();
  const gameEventSummarizer = new GameEventSummarizer(events, '/dump/gameEvent.csv');
  const victoryPointSummarizer = new VictoryPointSummarizer(events, '/dump/victoryPoint.csv');
  const playerInvestmentSummarizer = new PlayerInvestmentSummarizer(events, '/dump/playerInvestment.csv');
  const marsEventSummarizer = new MarsEventSummarizer(events, '/dump/marsEvent.csv');
  const accomplishmentSummarizer = new AccomplishmentSummarizer('/dump/accomplishment.csv')
  await Promise.all([gameEventSummarizer, victoryPointSummarizer, playerInvestmentSummarizer, marsEventSummarizer, accomplishmentSummarizer].map(s => s.save()))
}

async function finalize(em: EntityManager, gameId: number): Promise<void> {
  const s = getServices(em);
  const events = await s.game.findEventsByGameId(gameId);
  const replayer = new GameReplayer(events);
  const gameState = replayer.endState;
  const persister = new DBPersister();
  const gameEvents = [];
  console.log(`Phase: ${Phase[gameState.phase]}`);
  if (![Phase.defeat, Phase.victory].includes(gameState.phase)) {
    if (gameState.systemHealth <= 0) {
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
    await persister.finalize(gameId, true);
  }
}

async function createTournament(em: EntityManager, name: string): Promise<Tournament> {
  const s = getServices(em);
  const t = await s.tournament.createTournament({name, active: true});
  return t
}

async function createRound(
  em: EntityManager,
  name: string,
  roundData: {
    startDate: Date;
    endDate: Date;
  }): Promise<TournamentRound> {
  const s = getServices(em);
  const t = await s.tournament.getTournamentByName(name);
  const currentRound = await s.tournament.getCurrentTournamentRound();
  const round = await s.tournament.createRound({
    tournamentId: t.id,
    introSurveyUrl: currentRound.introSurveyUrl,
    exitSurveyUrl: currentRound.exitSurveyUrl,
    roundNumber: currentRound.roundNumber + 1,
    ...roundData
  })
  logger.info('created tournament round %d for tournament %s', round.roundNumber, t.name);
  return round;
}

interface CLIOpts {
  ids?: Array<number>,
  dateCreatedMin?: Date
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
              .requiredOption('--tournamentName [tournamentName]', 'id of tournament')
              .description('create a tournament round')
              .action(async (cmd) => {
                const startDate = new Date();
                const endDate = new Date(startDate.getTime() + 1000*60*60*24*3);
                await withConnection((em) => createRound(em, cmd.tournamentName, {startDate, endDate}));
                console.log('tournament round create...')
              })))
      .addCommand(
        program
          .createCommand('create')
          .requiredOption('--tournamentName', 'name of tournament')
          .description('create a tournament')
          .action(async (cmd) => {
            await withConnection((em) => createTournament(em, cmd.tournamentName))
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
            const gameId = parseInt(cmd.gameId);
            await withConnection((conn) => finalize(conn, gameId))
          })
      )
  )
  .addCommand(
    program.createCommand('dump')
      .description('dump db to csvs')
      .option('--ids <ids...>', 'game ids to extract', false)
      .option('--dateCreatedMin <dateCreatedMin>', 'minimum game dateCreated value', false)
      .action(async (cmd) => {
        const opts: CLIOpts = {};
        if (cmd.ids) {
          opts.ids = cmd.ids.map((id: string) => parseInt(id));
        }
        if (cmd.dateCreatedMin) {
          opts.dateCreatedMin = new Date(Date.parse(cmd.dateCreatedMin));
        }
        await withConnection((em) => exportData(em, opts))
      })
  );

async function main(argv: Array<string>): Promise<void> {
  await program.parseAsync(argv);
}

main(process.argv);