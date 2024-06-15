import _ from "lodash";
import * as assert from "assert";
import { Builder, Loader, Parser, Resolver, fixturesIterator } from "typeorm-fixtures-cli/dist";
import { ROLES, DashboardMessage, GameType } from "@port-of-mars/shared/types";
import { GameOpts, GameStateOpts } from "@port-of-mars/server/rooms/game/types";
import {
  getFixedMarsEventDeck,
  getRandomizedMarsEventDeck,
} from "@port-of-mars/server/rooms/game/state/marsevents/common";
import { Page, getPagePath } from "@port-of-mars/shared/routes";
import { getLogger, settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity";
import { ClientSafeUser } from "@port-of-mars/shared/types";
import dataSource from "@port-of-mars/server/datasource";

const logger = getLogger(__filename);

export async function loadFixtures() {
  const loader = new Loader();
  loader.load(__dirname + "/../fixtures");
  const resolver = new Resolver();
  const fixtures = resolver.resolve(loader.fixtureConfigs);
  const builder = new Builder(dataSource, new Parser(), false);
  for (const fixture of fixturesIterator(fixtures)) {
    const entity = await builder.build(fixture);
    await dataSource.getRepository(fixture.entity).save(entity);
  }
}

export function toUrl(page: Page): string {
  const pagePath = getPagePath(page);
  // getPagePath returns a string with initial slash
  return `${settings.host}${pagePath}`;
}

export function getRandomIntInclusive(min: number, max: number): number {
  if (min === max) return min;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export function toClientSafeUser(user: User): ClientSafeUser {
  const safeUser = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
    isMuted: user.isMuted,
    isBanned: user.isBanned,
    passedQuiz: user.passedQuiz,
    isVerified: user.isVerified,
    dateConsented: user.dateConsented,
    participantId: user.participantId,
  };
  return safeUser;
}

/**
 * This function needs some documentation some day.
 * @param deckStrategy
 * @param nRoundStrategy
 */
export function mockGameStateInitOpts(
  nRoundStrategy: () => number = () => getRandomIntInclusive(8, 12),
  username = "bob"
): GameStateOpts {
  const deck = getFixedMarsEventDeck();
  const numberOfGameRounds = nRoundStrategy();
  const usernames = [1, 2, 3, 4, 5].map(n => `${username}${n}`);
  const playerData = usernames.map(username => ({
    username: username,
    isBot: false,
    isMuted: false,
  }));
  const playerOpts: GameOpts["playerOpts"] = new Map();
  const shuffledRoles = _.shuffle(ROLES);
  playerData.forEach((p, i) => {
    playerOpts.set(shuffledRoles[i], p);
  });
  return {
    userRoles: _.zipObject(usernames, shuffledRoles),
    playerOpts,
    deck,
    numberOfGameRounds,
    type: "freeplay",
  };
}

export async function mockGameInitOpts(): Promise<GameOpts> {
  const currentTournamentRound = await getServices().tournament.getActiveTournament();
  return {
    ...mockGameStateInitOpts(),
    tournamentRoundId: currentTournamentRound.id,
  };
}

export async function buildGameOpts(usernames: Array<string>, type: GameType): Promise<GameOpts> {
  const services = getServices();
  const currentTournamentRound = await services.tournament.getCurrentTournamentRoundByType(type);
  assert.strictEqual(usernames.length, ROLES.length);
  logger.info("building game opts with current tournament round [%d]", currentTournamentRound.id);
  for (const u of usernames) {
    logger.debug("username: %s", u);
  }
  const playerData = await Promise.all(
    usernames.map(async username => {
      const user = await services.account.findByUsername(username);
      return {
        username: username,
        isBot: user.isSystemBot,
        isMuted: user.isMuted,
      };
    })
  );
  const playerOpts: GameOpts["playerOpts"] = new Map();
  const shuffledRoles = _.shuffle(ROLES);
  playerData.forEach((p, i) => {
    playerOpts.set(shuffledRoles[i], p);
  });
  const treatment = await services.tournament.getNextTreatment(currentTournamentRound.tournamentId);
  const eventOverrides = treatment?.marsEventOverrides ?? null;
  return {
    userRoles: _.zipObject(usernames, shuffledRoles),
    playerOpts,
    deck: getRandomizedMarsEventDeck(eventOverrides),
    numberOfGameRounds: currentTournamentRound.numberOfGameRounds,
    tournamentRoundId: currentTournamentRound.id,
    treatmentId: treatment?.id,
    type,
  };
}

export interface ServerErrorData {
  message: string;
  code: number;
  displayMessage?: string;
  error?: Error;
}

export class ServerError extends Error implements ServerErrorData {
  message = "";
  code = 500;
  displayMessage?: string;
  error?: Error;

  constructor(data: ServerErrorData) {
    super(data.message);
    Object.assign(this, data);
  }

  toDashboardMessage(): DashboardMessage {
    return { kind: "warning", message: this.getDisplayMessage() };
  }

  getDisplayMessage(): string {
    return this.displayMessage ?? this.message;
  }
}

export class ValidationError extends ServerError {
  constructor(data: { displayMessage: string }) {
    super({ ...data, message: "Invalid request", code: 400 });
  }
}

export async function generatePassword() {
  // TODO: take in N param for num of words to use
  // use random-words package?
}

export async function generateUsername() {
  // FIXME: take in N param for numbers to tack on the end, default 4
  let isUnique = false;
  let username = "";
  while (!isUnique) {
    const adj = Math.floor(Math.random() * ADJECTIVES.length);
    const noun = Math.floor(Math.random() * NOUNS.length);
    const num = Math.floor(1000 + Math.random() * 9000);
    username = ADJECTIVES[adj] + NOUNS[noun] + num;
    isUnique = await getServices().account.isUsernameAvailable(username);
  }

  return username;
}

export function generateCode(length: number, options?: string): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'; 
  const numbers = '0123456789';
  let charset = '';
  let code = '';
  if (options === 'alphabetic'){
    charset += alphabet;
  } else if (options === 'numeric'){
    charset += numbers;
  } else {
    charset = alphabet + numbers; //Default: alphanumeric
  }
  while(code.length !== length){
    const index = Math.floor(Math.random() * charset.length);
    code += charset.charAt(index);
  }
  return code;
}

const NOUNS = [
  "Ferret",
  "Marmot",
  "Bison",
  "Parrot",
  "Meerkat",
  "Orca",
  "Leopard",
  "Raccoon",
  "Quagga",
  "Newt",
  "Starfish",
  "Chameleon",
  "Orangutan",
  "Wolverine",
  "Ibex",
  "Antelope",
  "Axolotl",
  "Lizard",
  "Camel",
  "Dingo",
  "Dolphin",
  "Canary",
  "Eagle",
  "Falcon",
  "Fox",
  "Giraffe",
  "Hedgehog",
  "Heron",
  "Hyena",
  "Iguana",
  "Koala",
  "Lemur",
];

const ADJECTIVES = [
  "Astral",
  "Celestial",
  "Cosmic",
  "Solar",
  "Orbiting",
  "Elliptical",
  "Martian",
  "Lunar",
  "Illustrious",
  "Lunar",
  "Stellar",
  "Asteroidal",
  "Cometary",
  "Galactic",
  "Interstellar",
  "Nebular",
  "Planetary",
  "Auroral",
];
