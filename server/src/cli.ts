import {program} from 'commander'
import {createConnection, EntityManager} from "typeorm";
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
import _ from "lodash";

import fs from 'fs';

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
  logger.debug(eventQuery.getSql());
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
  logger.debug(`Phase: ${Phase[gameState.phase]}`);
  if (![Phase.defeat, Phase.victory].includes(gameState.phase)) {
    if (gameState.systemHealth <= 0) {
      logger.debug('game needs a entered defeat phase event. adding finalization event.')
      gameEvents.push(new EnteredDefeatPhase(gameState.playerScores));
    } else if (gameState.round >= gameState.maxRound) {
      logger.debug('game needs a entered victory phase event. adding finalization event.')
      gameEvents.push(new EnteredVictoryPhase(gameState.playerScores));
    } else {
      logger.debug('game was not completed. refusing to add finalize event.')
      process.exit(1);
    }
    await persister.persist(gameEvents, {gameId, dateCreated: new Date(), timeRemaining: gameState.timeRemaining})
    await persister.sync();
    await persister.finalize(gameId, true);
  }
}

async function createTournament(em: EntityManager, name: string): Promise<Tournament> {
  const s = getServices(em);
  return await s.tournament.createTournament({name, active: true});
}

async function createRound(
  em: EntityManager,
  name: string,
  introSurveyUrl: string,
  exitSurveyUrl: string
  ): Promise<TournamentRound> {
  const s = getServices(em);
  const t = await s.tournament.getTournamentByName(name);
  const currentRound = await s.tournament.getCurrentTournamentRound();
  const round = await s.tournament.createRound({
    tournamentId: t.id,
    introSurveyUrl: introSurveyUrl ? introSurveyUrl : currentRound.introSurveyUrl,
    exitSurveyUrl: exitSurveyUrl ? exitSurveyUrl : currentRound.exitSurveyUrl,
    roundNumber: currentRound.roundNumber + 1,
  })
  logger.info('created tournament round %d for tournament %s', round.roundNumber, t.name);
  return round;
}

async function createTournamentRoundInvites(em: EntityManager, tournamentRoundId: number, userIds: Array<number>): Promise<number> {
  const sp = getServices(em);
  const invites = await sp.tournament.createInvites(userIds, tournamentRoundId);
  logger.debug("created tournament round invites for %s", userIds);
  return invites.length;
}

async function exportEmails(em: EntityManager, tournamentRoundId: number): Promise<void> {
  const sp = getServices(em);
  const emails = await sp.tournament.getEmails(tournamentRoundId);
  logger.debug("emails: %s", emails);
  fs.writeFile('emails.txt', emails.join('\n'), (err) => {
    if (err) {
      logger.fatal("Unable to export emails: %s", err);
      throw err;
    }
    logger.debug("exported emails to emails.txt");
  });
}

async function createTournamentRoundDate(em: EntityManager, tournamentRoundId: number, date: Date): Promise<void> {
  const sp = getServices(em);
  const scheduledDate = await sp.tournament.createScheduledRoundDate(tournamentRoundId, date);
  logger.debug("created scheduled date: %o", scheduledDate);
}

function toIntArray(value: string, previous: Array<number>): Array<number> {
  return previous.concat([parseInt(value)])
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
            .createCommand('date')
            .requiredOption('--tournamentRoundId <tournamentRoundId>', 'ID of the tournament round', parseInt)
            .requiredOption('--date <date>', 'UTC Datetime for an upcoming scheduled game', s => new Date(Date.parse(s)))
            .description('add a TournamentRoundDate for the given date')
            .action(async (cmd) => {
              await withConnection(em => createTournamentRoundDate(em, cmd.tournamentRoundId, cmd.date));
            })
          )
          .addCommand(
            program
            .createCommand('emails')
            .requiredOption('--tournamentRoundId <tournamentRoundId>', 'ID of the tournament round', parseInt)
            .description('report emails for all users in the given tournament round')
            .action(async (cmd) => {
              await withConnection(em => exportEmails(em, cmd.tournamentRoundId));
            })
          )
          .addCommand(
            program
            .createCommand('invite')
            .requiredOption('--tournamentRoundId <tournamentRoundId>', 'ID of the tournament round', parseInt)
            .requiredOption('--userIds <userIds...>',
             'space separated list of user ids to invite', toIntArray, [] as Array<number>)
            .description('create invitations for the given users in the given tournament round')
            .action(async (cmd) => {
              await withConnection(em => createTournamentRoundInvites(em, cmd.tournamentRoundId, cmd.userIds));
            })
          )
          .addCommand(
            program
              .createCommand('create')
              .requiredOption('--tournamentName <tournamentName>', 'string name of an existing tournament')
              .option('--introSurveyUrl <introSurveyUrl>', 'introductory survey URL', '')
              .option('--exitSurveyUrl <exitSurveyUrl>', 'exit survey URL', '')
              .description('create a tournament round')
              .action(async (cmd) => {
                await withConnection((em) => createRound(em, cmd.tournamentName, cmd.introSurveyUrl, cmd.exitSurveyUrl));
                logger.debug('tournament round create %s [intro: %s] [exit: %s]', cmd.tournamentName, cmd.introSurveyUrl, cmd.exitSurveyUrl)
              })))
      .addCommand(
        program
          .createCommand('create')
          .requiredOption('--tournamentName <tournamentName>', 'string name of the tournament')
          .description('create a tournament')
          .action(async (cmd) => {
            await withConnection((em) => createTournament(em, cmd.tournamentName))
            logger.debug('tournament create...')
          })
      ))
  .addCommand(
    program.createCommand('game')
      .description('game subcommands')
      .addCommand(
        program
          .createCommand('finalize')
          .description('finalize a game that wasn\'t finalized properly')
          .requiredOption('--gameId <gameId>', 'id of game', parseInt)
          .action(async (cmd) => {
            await withConnection((conn) => finalize(conn, cmd.gameId))
          })
      )
  )
  .addCommand(
    program.createCommand('dump')
      .description('dump db to csvs')
      .option('--ids <ids...>', 'game ids to extract, separate multiples with spaces e.g., 1 2 3', toIntArray, [] as Array<number>)
      .option('--dateCreatedMin <dateCreatedMin>', 'return games after this ISO formatted date', false)
      .action(async (cmd) => {
        const opts: CLIOpts = {};
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