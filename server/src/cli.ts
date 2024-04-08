import { getRedis, getServices } from "@port-of-mars/server/services";
import {
  AccomplishmentSummarizer,
  GameSummarizer,
  GameEventSummarizer,
  GameReplayer,
  MarsEventSummarizer,
  MarsLogSummarizer,
  PlayerInvestmentSummarizer,
  PlayerSummarizer,
  VictoryPointSummarizer,
} from "@port-of-mars/server/services/replay";
import { DBPersister } from "@port-of-mars/server/services/persistence";
import { EnteredDefeatPhase, EnteredVictoryPhase } from "@port-of-mars/server/rooms/game/events";
import { MarsEventOverride, Phase } from "@port-of-mars/shared/types";
import { getLogger } from "@port-of-mars/server/settings";
import {
  Game,
  GameEvent,
  Player,
  Tournament,
  TournamentRound,
  TournamentRoundInvite,
  User,
} from "@port-of-mars/server/entity";
import { DYNAMIC_SETTINGS_PATH, RedisSettings } from "@port-of-mars/server/services/settings";
import { generateUsername } from "@port-of-mars/server/util";
import appDataSource from "@port-of-mars/server/datasource";

import { program } from "commander";
import { mkdir, readFile, writeFile } from "fs/promises";
import { EntityManager } from "typeorm";
/*
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
*/
const logger = getLogger(__filename);

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min) + min);
}

async function withDataSource<T>(func: (em: EntityManager) => Promise<T>): Promise<void> {
  await appDataSource.initialize();
  const em = appDataSource.manager;
  try {
    await func(em);
  } finally {
    await appDataSource.destroy();
  }
}

async function exportSoloData(em: EntityManager, start?: string, end?: string) {
  const soloGameService = getServices().sologame;
  await mkdir("/dump/solo", { recursive: true });
  let gameIds;
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      logger.fatal("Invalid date format");
      return;
    }
    gameIds = await soloGameService.getGameIdsBetween(startDate, endDate);
  } else if (start || end) {
    logger.fatal("Must specify both start and end dates or neither");
    return;
  }
  await getServices().sologame.exportGamesCsv("/dump/solo/games.csv", gameIds);
  await getServices().sologame.exportEventCardsCsv("/dump/solo/eventcards.csv", gameIds);
  await getServices().sologame.exportInvestmentsCsv("/dump/solo/investments.csv", gameIds);
}

async function exportTournament(em: EntityManager, tournamentId: number): Promise<void> {
  logger.debug("=====EXPORT TOURNAMENT [%d] DATA START=====", tournamentId);
  const s = getServices(em);
  const tournament = await s.tournament.getTournament(tournamentId, true);
  const rounds = tournament.rounds;
  for (const round of rounds) {
    await exportTournamentRound(em, round.id, round.roundNumber);
  }
}

async function exportTournamentRound(
  em: EntityManager,
  tournamentRoundId: number,
  tournamentRoundNumber: number,
  gameIds?: Array<number>
): Promise<void> {
  logger.debug("=====EXPORT TOURNAMENT ROUND [%d] START=====", tournamentRoundId);
  let eventQuery = em
    .getRepository(GameEvent)
    .createQueryBuilder("ge")
    .leftJoinAndSelect("ge.game", "g")
    .innerJoin(TournamentRound, "tournamentRound", "tournamentRound.id = g.tournamentRoundId")
    .where("tournamentRound.id = :tournamentRoundId", { tournamentRoundId })
    .orderBy("ge.id", "ASC");
  if (typeof gameIds !== "undefined" && gameIds.length > 0) {
    eventQuery = eventQuery.andWhere('"gameId" in (:...gameIds)', { gameIds });
  }
  const playerQuery = em
    .getRepository(Player)
    .createQueryBuilder("player")
    .innerJoinAndSelect(User, "user", "user.id = player.userId")
    .innerJoin(Game, "game", "game.id = player.gameId")
    .innerJoin(TournamentRound, "tournamentRound", "tournamentRound.id = game.tournamentRoundId")
    .leftJoinAndSelect(
      TournamentRoundInvite,
      "invitation",
      "invitation.tournamentRoundId = tournamentRound.id AND player.userId = invitation.userId"
    )
    .andWhere("tournamentRound.id = :tournamentRoundId", { tournamentRoundId });
  const playerRaw = await playerQuery.getRawMany();

  const events = await eventQuery.getMany();
  const gameQuery = em
    .getRepository(Game)
    .createQueryBuilder("game")
    .leftJoinAndSelect("game.treatment", "treatment")
    .where("game.tournamentRound.id = :tournamentRoundId", { tournamentRoundId });
  const games = await gameQuery.getMany();

  const rawDir = `/dump/${tournamentRoundNumber}/raw`;
  const processedDir = `/dump/${tournamentRoundNumber}/processed`;

  await mkdir(rawDir, { recursive: true });
  await mkdir(processedDir, { recursive: true });

  const gameSummarizer = new GameSummarizer(games, `${rawDir}/games.csv`);
  const playerInvestmentSummarizer = new PlayerInvestmentSummarizer(
    events,
    `${rawDir}/playerInvestment.csv`
  );
  const marsLogSummarizer = new MarsLogSummarizer(events, `${processedDir}/marsLog.csv`);
  const playerSummarizer = new PlayerSummarizer(playerRaw, `${processedDir}/player.csv`);
  const gameEventSummarizer = new GameEventSummarizer(events, `${processedDir}/gameEvent.csv`);
  const victoryPointSummarizer = new VictoryPointSummarizer(
    events,
    `${processedDir}/victoryPoint.csv`
  );
  const marsEventSummarizer = new MarsEventSummarizer(events, `${processedDir}/marsEvent.csv`);
  const accomplishmentSummarizer = new AccomplishmentSummarizer(
    `${processedDir}/accomplishment.csv`
  );
  await Promise.all(
    [
      marsLogSummarizer,
      playerSummarizer,
      gameSummarizer,
      gameEventSummarizer,
      victoryPointSummarizer,
      playerInvestmentSummarizer,
      marsEventSummarizer,
      accomplishmentSummarizer,
    ].map(s => s.save())
  );
  logger.debug("=====EXPORTING TOURNAMENT ROUND [%d] END=====", tournamentRoundId);
}

async function validate(em: EntityManager, gameId: number): Promise<void> {
  const s = getServices(em);
  const events = await s.game.findEventsByGameId(gameId);
  const replayer = new GameReplayer(events);
  try {
    const results = replayer.validate();
    console.log("===== Validation results: =====");
    for (const result of results) {
      console.log(`Round ${result.round}: ${result.success ? "SUCCESS" : "FAILED"}`);
      if (!result.success) {
        console.log(result.error);
      }
    }
    console.log("===============================");
  } catch (e) {
    console.log(e);
  }
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
      logger.debug("game needs a entered defeat phase event. adding finalization event.");
      gameEvents.push(new EnteredDefeatPhase(gameState.playerScores));
    } else if (gameState.round >= gameState.maxRound) {
      logger.debug("game needs a entered victory phase event. adding finalization event.");
      gameEvents.push(new EnteredVictoryPhase(gameState.playerScores));
    } else {
      logger.debug("game was not completed. refusing to add finalize event.");
      process.exit(1);
    }
    await persister.persist(gameEvents, {
      gameId,
      dateCreated: new Date(),
      timeRemaining: gameState.timeRemaining,
    });
    await persister.sync();
    await persister.finalize(gameId, true);
  }
}

async function createTournament(
  em: EntityManager,
  name: string,
  minRounds: number,
  maxRounds: number,
  description: string
): Promise<Tournament> {
  const services = getServices(em);
  return await services.tournament.createTournament({
    name,
    minNumberOfGameRounds: minRounds,
    maxNumberOfGameRounds: maxRounds,
    description: description,
    active: true,
  });
}

async function createTeacher(
  em: EntityManager,
  email: string,
  username: string,
  name: string
): Promise<void> {
  const services = getServices(em);
  const teacher = await services.educator.createTeacher(email, username, name);
  // TODO: print password
}

async function createClassroom(
  em: EntityManager,
  teacherUsername: string,
  descriptor: string
): Promise<void> {
  const services = getServices(em);
  const classroom = await services.educator.createClassroomForTeacher(teacherUsername, descriptor);
  // TODO: print classroom auth token
}

async function setAdminUser(em: EntityManager, username: string): Promise<void> {
  const services = getServices(em);
  try {
    const user = await services.account.setAdminByUsername(username);
    logger.info("set user '%s' (id: %d) as admin", user.username, user.id);
  } catch (e) {
    logger.warn("unable to set '%s' as admin", username);
    logger.warn(e as Error);
  }
}

async function anonymizeUsernames(
  em: EntityManager,
  startId: number,
  endId: number
): Promise<void> {
  const repo = em.getRepository(User);
  try {
    const users = await repo
      .createQueryBuilder("user")
      .where("user.id BETWEEN :startId AND :endId", { startId, endId })
      .getMany();
    const anonUsers = await Promise.all(
      users.map(async user => {
        user.username = await generateUsername();
        return user;
      })
    );
    await repo.save(anonUsers);
  } catch (e) {
    logger.fatal(e as Error);
  }
}

/**
 * FIXME: these two are mostly defunct now.
 */
async function checkQuizCompletion(em: EntityManager, ids: Array<number>): Promise<void> {
  const services = getServices(em);
  if (ids.length === 0) {
    const users = await services.quiz.getIncompleteQuizUsers();
    ids = users.map(u => u.id);
    logger.debug(
      "checking quiz completion for all verified users who haven't passed the quiz: %o",
      ids
    );
  }
  for (const userId of ids) {
    logger.debug("checking quiz completion for user id %d", userId);
    await services.quiz.checkQuizCompletion(userId);
  }
}

async function completeQuizCompletion(em: EntityManager, ids: Array<number>): Promise<void> {
  const services = getServices(em);
  for (const id of ids) {
    await services.quiz.setUserQuizCompletion(id, true);
  }
}

async function deactivateUsers(em: EntityManager, filename: string) {
  const services = getServices(em);
  const data = await readFile(filename);
  const emails = data.toString().split("\n");
  const numDeactivated = await services.account.deactivateUsers(emails);
  logger.debug(`deactivated ${numDeactivated} users`);
}

async function createRound(
  em: EntityManager,
  open?: boolean,
  id?: number,
  introSurveyUrl?: string,
  exitSurveyUrl?: string,
  numberOfGameRounds?: number,
  announcement?: string
): Promise<TournamentRound> {
  const s = getServices(em);
  let tournament = undefined;
  let currentRound:
    | Pick<TournamentRound, "roundNumber" | "introSurveyUrl" | "exitSurveyUrl">
    | undefined;
  if (open) {
    tournament = await s.tournament.getFreePlayTournament();
    currentRound = await s.tournament.getFreePlayTournamentRound().catch(err => undefined);
  } else {
    if (id) tournament = await s.tournament.getTournament(id);
    else tournament = await s.tournament.getActiveTournament();
    currentRound = await s.tournament.getCurrentTournamentRound().catch(err => undefined);
  }
  if (!currentRound) {
    currentRound = {
      roundNumber: 0,
      introSurveyUrl: "",
      exitSurveyUrl: "",
    };
  }
  if (!numberOfGameRounds) {
    numberOfGameRounds = getRandomInt(
      tournament.minNumberOfGameRounds,
      tournament.maxNumberOfGameRounds
    );
  }
  const round = await s.tournament.createRound({
    tournamentId: tournament.id,
    introSurveyUrl: introSurveyUrl ? introSurveyUrl : currentRound.introSurveyUrl,
    exitSurveyUrl: exitSurveyUrl ? exitSurveyUrl : currentRound.exitSurveyUrl,
    roundNumber: currentRound.roundNumber + 1,
    announcement,
    numberOfGameRounds,
  });
  logger.info("created tournament round %d for tournament %s", round.roundNumber, tournament.name);
  return round;
}

async function createTournamentRoundInvites(
  em: EntityManager,
  tournamentRoundId: number,
  userIds: Array<number>,
  hasParticipated: boolean
): Promise<number> {
  const sp = getServices(em);
  const invites = await sp.tournament.createInvites(userIds, tournamentRoundId, hasParticipated);
  logger.debug("created tournament round invites for %s", userIds.toString());
  return invites.length;
}

function formatEmail(user: User, enableAmdfFormat: boolean): string {
  if (enableAmdfFormat) {
    return user.name ? `${user.email} *${user.name}` : user.email!;
  }
  return `${user.name}, ${user.email}`;
}

async function exportActiveEmails(
  em: EntityManager,
  after: Date,
  enableAmdfFormat: boolean
): Promise<void> {
  const sp = getServices(em);
  logger.debug("exporting emails after %s", after.toISOString());
  const users = await sp.account.getActiveUsers(after);
  const emails = users.map(u => formatEmail(u, enableAmdfFormat));
  try {
    await writeFile("active-emails.csv", emails.join("\n"));
    logger.debug("Exported all active users with emails to active-emails.csv");
  } catch (e) {
    logger.fatal("unable to export active emails");
    logger.fatal(e as Error);
  }
}

async function exportTournamentRoundEmails(
  em: EntityManager,
  tournamentRoundId: number
): Promise<void> {
  const sp = getServices(em);
  const emails = await sp.tournament.getEmails(tournamentRoundId);
  const outputFile = "emails.txt";
  try {
    await writeFile(outputFile, emails.join("\n"));
    logger.debug(`exported round invitation emails to ${outputFile}`);
  } catch (e) {
    logger.fatal("Unable to export emails");
    logger.fatal(e as Error);
  }
}

async function addTreatments(
  em: EntityManager,
  treatmentIds: Array<number>,
  tournamentId?: number
) {
  const sp = getServices(em);
  await sp.tournament.addTreatmentsToTournament(treatmentIds, tournamentId);
}

async function createTournamentTreatment(
  em: EntityManager,
  name: string,
  description: string,
  overridesRaw: string,
  tournamentId?: number
): Promise<void> {
  const sp = getServices(em);
  let overrides: MarsEventOverride[];
  try {
    overrides = JSON.parse(overridesRaw);
    const treatment = await sp.tournament.createTreatment(
      name,
      description,
      overrides,
      tournamentId
    );
    logger.debug("created tournament treatment: %o", treatment);
  } catch (e) {
    logger.fatal("Unable to create treatment");
    logger.fatal(e as Error);
  }
}

async function createTournamentRoundDate(
  em: EntityManager,
  date: Date,
  tournamentRoundId?: number
): Promise<void> {
  const sp = getServices(em);
  if (date.getMinutes() !== 0) {
    logger.fatal("Only dates on the hour are currently supported: %o", date);
    return;
  }
  const scheduledDate = await sp.tournament.createScheduledRoundDate(date, tournamentRoundId);
  logger.debug("created scheduled date: %o", scheduledDate);
}

function toIntArray(value: string, previous: Array<number>): Array<number> {
  return previous.concat([parseInt(value)]);
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

/**
 * Set up commander program CLI options.
 */
const DEFAULT_AFTER_DATE = new Date("2021-01-23");
program
  .addCommand(
    program
      .createCommand("tournament")
      .description("tournamament subcommands")
      .addCommand(
        program
          .createCommand("treatment")
          .description("treatment subcommands")
          .addCommand(
            program
              .createCommand("add")
              .requiredOption(
                "--treatmentIds <treatmentIds...>",
                "space separated list of treatment ids to add",
                toIntArray,
                [] as Array<number>
              )
              .option("--tournamentId <tournamentId>", "ID of the tournament", customParseInt)
              .description("link existing Treatments to a given Tournament")
              .action(async cmd => {
                await withDataSource(async em =>
                  addTreatments(em, cmd.treatmentIds, cmd.tournamentId)
                );
              })
          )
          .addCommand(
            program
              .createCommand("create")
              .requiredOption("-n --name <name>", "Treatment name")
              .requiredOption("-d --description <description>", "Treatment description")
              .requiredOption(
                "-o --overrides <overrides>",
                "Mars event overrides (JSON string, e.g., '[ {'eventId': 'lifeAsUsual', 'quantity': 12} ])"
              )
              .option("--tournamentId <tournamentId>", "ID of the tournament", customParseInt)
              .description("add a Treatment (set of mars event overrides) to a Tournament")
              .action(async cmd => {
                await withDataSource(async em =>
                  createTournamentTreatment(
                    em,
                    cmd.name,
                    cmd.description,
                    cmd.overrides,
                    cmd.tournamentId
                  )
                );
              })
          )
      )
      .addCommand(
        program
          .createCommand("round")
          .description("round subcommands")
          .addCommand(
            program
              .createCommand("date")
              .requiredOption(
                "-d, --date <date>",
                "UTC Datetime for an upcoming scheduled game",
                s => new Date(Date.parse(s))
              )
              .option(
                "--tournamentRoundId <tournamentRoundId>",
                "ID of the tournament round",
                customParseInt
              )
              .description("add a TournamentRoundDate for the given date")
              .action(async cmd => {
                await withDataSource(async em =>
                  createTournamentRoundDate(em, cmd.date, cmd.tournamentRoundId)
                );
              })
          )
          .addCommand(
            program
              .createCommand("emails")
              .option(
                "--tournamentRoundId <tournamentRoundId>",
                "ID of the tournament round",
                customParseInt
              )
              .description("report emails for all users in the given tournament round")
              .action(async cmd => {
                await withDataSource(async em =>
                  exportTournamentRoundEmails(em, cmd.tournamentRoundId)
                );
              })
          )
          .addCommand(
            program
              .createCommand("invite")
              .requiredOption(
                "--userIds <userIds...>",
                "space separated list of user ids to invite",
                toIntArray,
                [] as Array<number>
              )
              .option(
                "--tournamentRoundId <tournamentRoundId>",
                "ID of the tournament round",
                customParseInt
              )
              .option(
                "-p, --participated",
                "Set to mark these users as having already participated"
              )
              .description("create invitations for the given users in the given tournament round")
              .action(async cmd => {
                await withDataSource(async em =>
                  createTournamentRoundInvites(
                    em,
                    cmd.tournamentRoundId,
                    cmd.userIds,
                    cmd.participated
                  )
                );
              })
          )
          .addCommand(
            program
              .createCommand("create")
              .option("-o, --open", "create a tournament round")
              .option(
                "--tournamentId <tournamentId>",
                "id of an existing tournament",
                customParseInt
              )
              .option("--introSurveyUrl <introSurveyUrl>", "introductory survey URL", "")
              .option("--exitSurveyUrl <exitSurveyUrl>", "exit survey URL", "")
              .option(
                "--numberOfGameRounds <numberOfGameRounds>",
                "number of game rounds for this TournamentRound",
                customParseInt,
                11
              )
              .option("--announcement <announcement>", "Tournament Round announcement message", "")
              .description("create a tournament round")
              .action(async cmd => {
                await withDataSource(async em =>
                  createRound(
                    em,
                    cmd.open,
                    cmd.tournamentId,
                    cmd.introSurveyUrl,
                    cmd.exitSurveyUrl,
                    cmd.numberOfGameRounds,
                    cmd.announcement
                  )
                );
                logger.debug(
                  "tournament round create %s [intro: %s] [exit: %s] [numberOfGameRounds: %d",
                  cmd.tournamentId,
                  cmd.introSurveyUrl,
                  cmd.exitSurveyUrl,
                  cmd.numberOfGameRounds
                );
              })
          )
      )
      .addCommand(
        program
          .createCommand("create")
          .requiredOption("--tournamentName <tournamentName>", "string name of the tournament")
          .option("--minRounds <minRounds>", "Minimum number of game rounds", customParseInt, 8)
          .option("--maxRounds <maxRounds>", "Maximum number of game rounds", customParseInt, 12)
          .option("--description <description>", "Description of the tournament")
          .description("create a tournament")
          .action(async cmd => {
            await withDataSource(async em =>
              createTournament(
                em,
                cmd.tournamentName,
                cmd.minRounds,
                cmd.maxRounds,
                cmd.description
              )
            );
            logger.debug("created tournament %s", cmd.tournamentName);
          })
      )
  )
  .addCommand(
    program
      .createCommand("accounts")
      .description("account subcommands")
      .addCommand(
        program
          .createCommand("setadmin")
          .description("set a user as an administrator")
          .requiredOption("--username <username>", "username of the user")
          .action(async cmd => {
            await withDataSource(async em => setAdminUser(em, cmd.username));
          })
      )
      .addCommand(
        program
          .createCommand("anon")
          .description("anonymize a range of users' usernames")
          .requiredOption("--startId <startUserId>", "initial user ID in range", customParseInt, 1)
          .requiredOption("--endId <endUserId>", "end user ID in range", customParseInt, 1942)
          .action(async cmd => {
            await withDataSource(async em => anonymizeUsernames(em, cmd.startId, cmd.endId));
          })
      )
  )
  .addCommand(
    program
      .createCommand("game")
      .description("game subcommands")
      .addCommand(
        program
          .createCommand("finalize")
          .description("finalize a game that wasn't finalized properly")
          .requiredOption("--gameId <gameId>", "id of game", customParseInt)
          .action(async cmd => {
            await withDataSource(async em => finalize(em, cmd.gameId));
          })
      )
      .addCommand(
        program
          .createCommand("validate")
          .description(
            "verify that the replayer is producing correct results according to game state snaphots"
          )
          .requiredOption("--gameId <gameId>", "id of game", customParseInt)
          .action(async cmd => {
            await withDataSource(async em => validate(em, cmd.gameId));
          })
      )
  )
  .addCommand(
    program
      .createCommand("dump")
      .description(
        "subcommands to dump game data for a given tournament/round or from the solo minigame"
      )
      .addCommand(
        program
          .createCommand("tournament")
          .description("dump game data for a given tournament round id to a pile of CSV files")
          .requiredOption("--tournamentId <tournamentId>", "tournament id", customParseInt)
          .action(async cmd => {
            await withDataSource(async em => exportTournament(em, cmd.tournamentId));
          })
      )
      .addCommand(
        program
          .createCommand("round")
          .description("dump game data for a given tournament round id")
          .requiredOption(
            "--tournamentRoundId <tournamentRoundId>",
            "tournament round id",
            customParseInt
          )
          .option(
            "--gids <game_ids>",
            "specific game ids to export",
            toIntArray,
            [] as Array<number>
          )
          .action(async cmd => {
            await withDataSource(async em => exportTournamentRound(em, cmd.tournamentId, cmd.gids));
          })
      )
      .addCommand(
        program
          .createCommand("solo")
          .description("export solo game data to flat CSV files")
          .option("-s, --start <date>", "Start date (YYYY-MM-DD)")
          .option("-e, --end <date>", "End date (YYYY-MM-DD)")
          .action(async cmd => {
            await withDataSource(async em => exportSoloData(em, cmd.start, cmd.end));
          })
      )
  )
  .addCommand(
    program
      .createCommand("checkquiz")
      .description("commands for checking quiz completion")
      .option(
        "--ids <ids...>",
        "user ids to check, separate multiples with spaces, e.g., 1 2 3",
        toIntArray,
        [] as Array<number>
      )
      .action(async cmd => {
        await withDataSource(async em => checkQuizCompletion(em, cmd.ids));
      })
  )
  .addCommand(
    program
      .createCommand("completequiz")
      .description("mark quiz for user as complete")
      .option(
        "--ids <ids...>",
        "user ids to mark quiz completion for",
        toIntArray,
        [] as Array<number>
      )
      .action(async cmd => {
        await withDataSource(async em => completeQuizCompletion(em, cmd.ids));
      })
  )
  .addCommand(
    program
      .createCommand("emails")
      .option(
        "-a, --after <after_date>",
        "Only select participants created after the date yyyy-mm-dd",
        s => new Date(Date.parse(s)),
        DEFAULT_AFTER_DATE
      )
      .option("-m, --enable-amdf", "Emit CSV in ASU AMDF email format")
      .description(
        "generate a CSV for mailchimp import of all active users with a valid email address"
      )
      .action(async cmd => {
        await withDataSource(async em => exportActiveEmails(em, cmd.after, cmd.enableAmdf));
      })
  )
  .addCommand(
    program
      .createCommand("deactivate")
      .option(
        "-f, --filename <emails>",
        "A file with a list of emails to deactivate, one email per line.",
        "inactive.csv"
      )
      .description("Deactivate users who have unsubscribed from emails (currently from mailchimp).")
      .action(async cmd => {
        await withDataSource(async em => deactivateUsers(em, cmd.filename));
      })
  )
  .addCommand(
    program
      .createCommand("settings")
      .description("subcommands for dynamic settings in redis")
      .addCommand(
        program
          .createCommand("reload")
          .description(`reload settings from the file system at ${DYNAMIC_SETTINGS_PATH}`)
          .action(async cmd => {
            try {
              const client = getRedis();
              logger.debug("reloading dynamic settings");
              const settings = new RedisSettings(client);
              const code = await settings.reload();
              logger.debug({ code });
              logger.debug("reloaded settings into redis");
            } catch (e) {
              console.error(`reloading settings failed: ${e}`);
              process.exit(1);
            } finally {
              getRedis().quit();
            }
          })
      )
      .addCommand(
        program
          .createCommand("report")
          .description("Report current redis settings")
          .action(async cmd => {
            try {
              const client = getRedis();
              const settings = new RedisSettings(client);
              await settings.loadIfNotExist();
              const report = await settings.report();
              logger.debug("Current Redis Settings: %s", report);
            } finally {
              getRedis().quit();
            }
          })
      )
  )
  .addCommand(
    program
      .createCommand("edu")
      .description("subcommands for educator mode administration")
      .addCommand(
        program
          .createCommand("teacher")
          .description("subcommands for teachers within educator mode")
          .addCommand(
            program
              .createCommand("create")
              .description("create a new teacher user")
              .requiredOption("--email <email>", "teacher's email")
              .requiredOption("--username <username>", "username")
              .requiredOption("--name <name>", "full name")
              .action(async cmd => {
                await withConnection(em => createTeacher(em, cmd.email, cmd.username, cmd.name));
              })
          )
          .addCommand(
            program
              .createCommand("classroom")
              .description("create a new classroom for a teacher")
              .requiredOption("--username <username>", "username of the teacher")
              .requiredOption("--descriptor <descriptor>", "classroom descriptor")
              .action(async cmd => {
                await withConnection(em => createClassroom(em, cmd.username, cmd.descriptor));
              })
          )
      )
  );

async function main(argv: Array<string>): Promise<void> {
  await program.parseAsync(argv);
}

main(process.argv);
