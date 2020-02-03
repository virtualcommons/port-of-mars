import {Loader, Resolver} from "typeorm-fixtures-cli/dist";
import path from "path";
import _ from "lodash";
import {Role, ROLES} from "shared/types";
import {GameOpts, Persister} from "@/game/room/types";
import * as assert from "assert";
import {ConsolePersister} from "@/services/persistence";
import * as to from "typeorm";

export function getConnection(): to.Connection {
  const connection_name = process.env.NODE_ENV === 'test' ? 'test': 'default';
  return to.getConnection(connection_name)
}

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export function mockGameInitOpts(persister: Persister): GameOpts {
  const loader = new Loader();
  loader.load(path.resolve(__dirname, '../fixtures'));
  const fixtures = new Resolver().resolve(loader.fixtureConfigs);
  return {
    userRoles: _.zipObject(fixtures.filter(f => f.entity === 'User').map(f => f.data.username), ROLES),
    tournamentId: 1,
    persister
  };
}

export function buildGameOpts(usernames: Array<string>): GameOpts {
  assert.equal(usernames.length, ROLES.length);
  return {
    userRoles: _.zipObject(usernames, ROLES),
    tournamentId: 1,
    persister: new ConsolePersister()
  };
}