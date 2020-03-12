import {Loader, Resolver} from "typeorm-fixtures-cli/dist";
import path from "path";
import _ from "lodash";
import {MarsEventData, ROLES} from "shared/types";
import {GameOpts, GameStateOpts, Persister} from "@/rooms/game/types";
import * as assert from "assert";
import {ConsolePersister, DBPersister} from "@/services/persistence";
import * as to from "typeorm";
import {expandCopies} from "@/rooms/game/state/marsEvents/common";
import {getAllMarsEvents} from "@/data/MarsEvents";
import {TournamentRound} from "@/entity/TournamentRound";
import {Page, PAGE_META} from "shared/routes";
import {settings} from "@/settings";

export function getConnection(): to.Connection {
  const connection_name = process.env.NODE_ENV === 'test' ? 'test' : 'default';
  return to.getConnection(connection_name)
}

export function toUrl(page: Page): string {
  const page_metadata = PAGE_META[page];
  return `${settings.host}/#${page_metadata.path}`
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
  const round = nRoundStrategy();
  const userRoles = _.zipObject(
    fixtures.filter(f => f.entity === 'User')
      .map(f => f.data.username)
      .filter((name: string) => name.includes('bob')), ROLES);

  return {
    userRoles,
    deck,
    round
  };
}

export async function mockGameInitOpts(persister: Persister): Promise<GameOpts> {
  const tr = await getConnection().getRepository(TournamentRound).findOneOrFail();
  return {
    ...mockGameStateInitOpts(),
    tournamentRoundId: tr.id,
    persister
  };
}

export async function buildGameOpts(usernames: Array<string>, persister: Persister): Promise<GameOpts> {
  assert.equal(usernames.length, ROLES.length);
  const tr = await getConnection().getRepository(TournamentRound).findOneOrFail();
  return {
    userRoles: _.zipObject(usernames, ROLES),
    deck: _.shuffle(getMarsEventData()),
    round: getRandomIntInclusive(8, 12),
    tournamentRoundId: tr.id,
    persister
  };
}