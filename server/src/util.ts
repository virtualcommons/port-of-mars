import _ from "lodash";
import * as assert from "assert";
import * as to from "typeorm";
import {ROLES, DashboardMessage} from "@port-of-mars/shared/types";
import {GameOpts, GameStateOpts} from "@port-of-mars/server/rooms/game/types";
import {getFixedMarsEventDeck, getRandomizedMarsEventDeck} from "@port-of-mars/server/rooms/game/state/marsevents/common";
import {Page, getPagePath} from "@port-of-mars/shared/routes";
import {getLogger, settings} from "@port-of-mars/server/settings";
import {getServices} from "@port-of-mars/server/services";

const logger = getLogger(__filename);

export function getConnection(): to.Connection {
  const connectionName = process.env.NODE_ENV === 'test' ? 'test' : 'default';
  return to.getConnection(connectionName)
}

export function toUrl(page: Page): string {
  const pagePath = getPagePath(page);
  // getPagePath returns a string with initial slash
  return `${settings.host}${pagePath}`
}

export function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

/**
 * This function needs some documentation some day.
 * @param deckStrategy
 * @param nRoundStrategy
 */
export function mockGameStateInitOpts(
  nRoundStrategy: () => number = () => getRandomIntInclusive(8, 12),
  username = 'bob'
): GameStateOpts {
  const deck = getFixedMarsEventDeck();
  const numberOfGameRounds = nRoundStrategy();
  const usernames = [1, 2, 3, 4, 5].map(n => `${username}${n}`);
  const playerData = usernames.map((username) => ({
    username: username,
    isBot: false,
    isMuted: false
  }));
  const playerOpts: GameOpts["playerOpts"] = new Map();
  playerData.forEach((p, i) => {
    playerOpts.set(ROLES[i], p);
  });
  return {
    userRoles: _.zipObject(usernames, ROLES),
    playerOpts,
    deck,
    numberOfGameRounds
  };
}

export async function mockGameInitOpts(): Promise<GameOpts> {
  const currentTournamentRound = await getServices().tournament.getActiveTournament();
  return {
    ...mockGameStateInitOpts(),
    tournamentRoundId: currentTournamentRound.id,
  };
}

export async function buildGameOpts(usernames: Array<string>, isOpenGame: boolean = true): Promise<GameOpts> {
  const services = getServices();
  const currentTournamentRound = await services.tournament.getCurrentTournamentRound();
  assert.equal(usernames.length, ROLES.length);
  logger.info("building game opts with current tournament round [%d]", currentTournamentRound.id);
  for (const u of usernames) {
    logger.debug("username: %s", u);
  }
  const playerData = await Promise.all(usernames.map(async (username) => {
    const user = await services.account.findByUsername(username);
    return {
      username: username,
      isBot: user.isSystemBot,
      isMuted: user.isMuted
    }
  }));
  const playerOpts: GameOpts["playerOpts"] = new Map();
  playerData.forEach((p, i) => {
    playerOpts.set(ROLES[i], p);
  });
  return {
    userRoles: _.zipObject(usernames, ROLES),
    playerOpts,
    deck: getRandomizedMarsEventDeck(),
    numberOfGameRounds: currentTournamentRound.numberOfGameRounds,
    tournamentRoundId: currentTournamentRound.id,
  };
}

export interface ServerErrorData {
  message: string;
  code: number;
  displayMessage?: string;
  error?: Error;
}

export class ServerError extends Error implements ServerErrorData {

  message = '';
  code = 500;
  displayMessage?: string;
  error?: Error;

  constructor(data: ServerErrorData) {
    super(data.message);
    Object.assign(this, data);
  }

  toDashboardMessage(): DashboardMessage {
    return {kind: 'warning', message: this.getDisplayMessage()};
  }

  getDisplayMessage(): string {
    return this.displayMessage ?? this.message;
  }
}

export async function generateUsername() {
  const NOUNS = [
    'Ferret',
    'Marmot',
    'Bison',
    'Parrot',
    'Meerkat',
    'Orca',
    'Leopard',
    'Raccoon',
    'Quagga',
    'Newt',
    'Starfish',
    'Chameleon',
    'Orangutan',
    'Wolverine',
    'Ibex',
    'Antelope',
    'Axolotl',
    'Lizard',
    'Camel',
    ];
    
  const ADJECTIVES = [
    'Astral',
    'Celestial',
    'Cosmic',
    'Solar',
    'Orbiting',
    'Elliptical',
    'Martian',
  ];

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
