import {program} from 'commander'
import {createConnection, EntityManager} from "typeorm";
import {getRedis, getServices} from "@port-of-mars/server/services";
import {
  AccomplishmentSummarizer,
  GameEventSummarizer,
  GameReplayer, MarsEventSummarizer,
  PlayerInvestmentSummarizer, PlayerSummarizer,
  VictoryPointSummarizer
} from "@port-of-mars/server/services/replay";
import {DBPersister} from "@port-of-mars/server/services/persistence";
import {EnteredDefeatPhase, EnteredVictoryPhase} from "@port-of-mars/server/rooms/game/events";
import {Phase} from "@port-of-mars/shared/types";
import {getLogger} from "@port-of-mars/server/settings";
import {
  Game,
  GameEvent,
  Player,
  Tournament,
  TournamentRound,
  TournamentRoundInvite,
  User
} from "@port-of-mars/server/entity";
import {promisify} from "util";

import fs from 'fs';
import {DYNAMIC_SETTINGS_PATH, RedisSettings} from "@port-of-mars/server/services/settings";

const mkdir = promisify(fs.mkdir);
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

async function exportData(em: EntityManager, ids?: Array<number>, dateCreatedMin?: Date): Promise<void> {
  // FIXME: it would be good to disable the pino logger for the duration of this call so we don't repeat
  // all the logging spam as we replay events
  logger.debug("=====EXPORTING DATA START=====");
  let eventQuery = await em.getRepository(GameEvent)
    .createQueryBuilder("ge")
    .leftJoinAndSelect("ge.game", "g")
    .orderBy('ge.id', 'ASC');
  if (ids && ids.length > 0) {
    eventQuery = eventQuery.where('gameId in (:...ids)', {ids});
  }
  if (dateCreatedMin) {
    if (ids && ids.length > 0) {
      eventQuery = eventQuery.andWhere('g.dateCreated > (:dateCreatedMin)', {dateCreatedMin: dateCreatedMin});
    } else {
      eventQuery = eventQuery.where('g.dateCreated > (:dateCreatedMin)', {dateCreatedMin: dateCreatedMin});
    }
  }
  logger.debug(eventQuery.getSql());
  const playerQuery = em.getRepository(Player)
    .createQueryBuilder('player')
    .innerJoinAndSelect(User, 'user', 'user.id = player.userId')
    .innerJoin(Game, 'game', 'game.id = player.gameId')
    .innerJoin(TournamentRound, 'tournamentRound', 'tournamentRound.id = game.tournamentRoundId')
    .innerJoinAndSelect(TournamentRoundInvite, 'invitation', 'invitation.tournamentRoundId = tournamentRound.id')
    .where('player.userId = invitation.userId');
  if (ids && ids.length > 0) {
    playerQuery
      .andWhere('game.id in (:...ids)', {ids});
  }
  logger.debug(playerQuery.getSql());
  const playerRaw = await playerQuery.getRawMany();

  const events = await eventQuery.getMany();
  await mkdir('/dump/processed', {recursive: true});
  await mkdir('/dump/raw', {recursive: true});
  const playerSummarizer =  new PlayerSummarizer(playerRaw, '/dump/processed/player.csv');
  const gameEventSummarizer = new GameEventSummarizer(events, '/dump/processed/gameEvent.csv');
  const victoryPointSummarizer = new VictoryPointSummarizer(events, '/dump/processed/victoryPoint.csv');
  const playerInvestmentSummarizer = new PlayerInvestmentSummarizer(events, '/dump/raw/playerInvestment.csv');
  const marsEventSummarizer = new MarsEventSummarizer(events, '/dump/processed/marsEvent.csv');
  const accomplishmentSummarizer = new AccomplishmentSummarizer('/dump/processed/accomplishment.csv')
  await Promise.all([playerSummarizer, gameEventSummarizer, victoryPointSummarizer, playerInvestmentSummarizer, marsEventSummarizer, accomplishmentSummarizer].map(s => s.save()))
  logger.debug("=====EXPORTING DATA END=====");
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
  exitSurveyUrl: string,
  numberOfGameRounds: number,
  ): Promise<TournamentRound> {
  const s = getServices(em);
  const t = await s.tournament.getTournamentByName(name);
  let currentRound: Pick<TournamentRound, 'roundNumber' | 'introSurveyUrl' | 'exitSurveyUrl'> | undefined =
   await s.tournament.getCurrentTournamentRound().catch(err => undefined);
  if (! currentRound) {
    currentRound = {
      roundNumber: 0,
      introSurveyUrl: '',
      exitSurveyUrl: '',
    }
  }
  const round = await s.tournament.createRound({
    tournamentId: t.id,
    introSurveyUrl: introSurveyUrl ? introSurveyUrl : currentRound.introSurveyUrl,
    exitSurveyUrl: exitSurveyUrl ? exitSurveyUrl : currentRound.exitSurveyUrl,
    roundNumber: currentRound.roundNumber + 1,
    numberOfGameRounds
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

/**
 * Workaround for commander custom options processing, otherwise any default values specified get used as the second arg
 * to parseInt (e.g., as the radix). For number of game rounds this turns into something like parseInt(<incoming-value>, 12)
 * which is completely not what we want.
 * 
 * https://github.com/tj/commander.js/blob/master/examples/options-custom-processing.js
 * 
 * @param value 
 * @param ignored 
 */
function customParseInt(value: string, ignored: number): number {
  return parseInt(value);
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
              .option('--numberOfGameRounds <numberOfGameRounds>', 'number of game rounds for this TournamentRound', customParseInt, 11)
              .description('create a tournament round')
              .action(async (cmd) => {
                await withConnection((em) => createRound(em, cmd.tournamentName, cmd.introSurveyUrl, cmd.exitSurveyUrl, cmd.numberOfGameRounds));
                logger.debug('tournament round create %s [intro: %s] [exit: %s] [numberOfGameRounds: %d',
                 cmd.tournamentName, cmd.introSurveyUrl, cmd.exitSurveyUrl, cmd.numberOfGameRounds)
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
      .option('--dateCreatedMin <dateCreatedMin>', 'return games after this ISO formatted date', s => new Date(Date.parse(s)))
      .action(async (cmd) => {
        await withConnection((em) => exportData(em, cmd.ids, cmd.dateCreatedMin))
      })
  )
  .addCommand(
    program.createCommand('settings')
      .description('subcommands for dynamic settings in redis')
      .addCommand(
        program.createCommand('reload')
          .description(`reload settings from the file system at ${DYNAMIC_SETTINGS_PATH}`)
          .action(async (cmd) => {
            try {
              const client = getRedis();
              logger.debug('reloading dynamic settings');
              const settings = new RedisSettings(client);
              const code = await settings.reload();
              logger.debug({code});
              if (code) {
                console.error(`reloading settings failed with code ${code}`);
                process.exit(code);
              }
              logger.debug('reloaded settings into redis');
            } finally {
              getRedis().quit();
            }
          })
      )
      .addCommand(
        program.createCommand('report')
          .description('Report current redis settings')
          .action(async (cmd) => {
            try {
              const client = getRedis();
              const settings = new RedisSettings(client);
              await settings.loadIfNotExist();
              const maxConnections = await settings.getMaxConnections();
              logger.debug("Current max connections: %d", maxConnections);
            } finally {
              getRedis().quit();
            }
          })
      )
  );

async function main(argv: Array<string>): Promise<void> {
  await program.parseAsync(argv);
}

main(process.argv);
