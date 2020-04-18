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
import { Page, PAGE_META } from "@port-of-mars/shared/routes";
import { settings } from "@port-of-mars/server/settings";

export function getConnection(): to.Connection {
  const connectionName = process.env.NODE_ENV === 'test' ? 'test' : 'default';
  return to.getConnection(connectionName)
}

// FIXME: seems like this method should live in shared/routes instead since it's operating on all of the things that shared/routes is responsible for.
export function toUrl(page: Page): string {
  const pageMetadata = PAGE_META[page];
  return `${settings.host}/#${pageMetadata.path}`
}

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getMarsEventData(): Array<MarsEventData> {
  return _.clone(expandCopies(getAllMarsEvents()));
}

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
  return {
    userRoles: _.zipObject(usernames, ROLES),
    deck: _.shuffle(getMarsEventData()),
    numberOfGameRounds: currentTournamentRound.numberOfGameRounds,
    tournamentRoundId: currentTournamentRound.id,
    persister
  };
}
