import { Loader, Resolver } from "typeorm-fixtures-cli/dist";
import path from "path";
import _ from "lodash";
import { MarsEventData, ROLES } from "@port-of-mars/shared/types";
import { GameOpts, GameStateOpts, Persister } from "@port-of-mars/server/rooms/game/types";
import * as assert from "assert";
import * as to from "typeorm";
import { expandCopies } from "@port-of-mars/server/rooms/game/state/marsEvents/common";
import { getAllMarsEvents } from "@port-of-mars/server/data/MarsEvents";
import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { Page, getPagePath } from "@port-of-mars/shared/routes";
import { getLogger, settings } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export function getConnection(): to.Connection {
  const connectionName = process.env.NODE_ENV === 'test' ? 'test' : 'default';
  return to.getConnection(connectionName)
}

export function toUrl(page: Page): string {
  const pagePath = getPagePath(page);
  return `${settings.host}/#${pagePath}`
}

export function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getMarsEventData(): Array<MarsEventData> {
  return _.clone(expandCopies(getAllMarsEvents()));
}

/**
 * This function needs some documentation some day.
 * @param deckStrategy 
 * @param nRoundStrategy 
 */
export function mockGameStateInitOpts(
  deckStrategy: (events: Array<MarsEventData>) => Array<MarsEventData> = x => x,
  nRoundStrategy: () => number = () => getRandomIntInclusive(8, 12)): GameStateOpts {
  const loader = new Loader();
  loader.load(path.resolve(__dirname, '../fixtures'));
  const fixtures = new Resolver().resolve(loader.fixtureConfigs);
  const deck = deckStrategy(_.clone(expandCopies(getAllMarsEvents())));
  const numberOfGameRounds = nRoundStrategy();
  const userRoles = _.zipObject(
    fixtures.filter(f => f.entity === 'User')
      .map(f => f.data.username)
      .filter((name: string) => name.includes('bob')), ROLES);

  return {
    userRoles,
    deck,
    numberOfGameRounds
  };
}

export async function mockGameInitOpts(persister: Persister): Promise<GameOpts> {
  // FIXME: this should be retrieving the tournament round via TournamentService.getCurrentRound() or equivalent
  const currentTournamentRound = await getConnection().getRepository(TournamentRound).findOneOrFail();
  return {
    ...mockGameStateInitOpts(),
    tournamentRoundId: currentTournamentRound.id,
    persister
  };
}

export async function buildGameOpts(usernames: Array<string>, persister: Persister): Promise<GameOpts> {
  assert.equal(usernames.length, ROLES.length);
  // FIXME: this should be retrieving the tournament round via TournamentService.getCurrentRound() or equivalent
  const currentTournamentRound = await getConnection().getRepository(TournamentRound).findOneOrFail();
  logger.info("building game opts with current tournament round [%d]", currentTournamentRound.id);
  return {
    userRoles: _.zipObject(usernames, ROLES),
    deck: _.shuffle(getMarsEventData()),
    numberOfGameRounds: currentTournamentRound.numberOfGameRounds,
    tournamentRoundId: currentTournamentRound.id,
    persister
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

  getDisplayMessage(): string {
    return this.displayMessage ?? this.message;
  }
}