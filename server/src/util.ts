import {Loader, Resolver} from "typeorm-fixtures-cli/dist";
import path from "path";
import _ from "lodash";
import {Role, ROLES} from "shared/types";
import {GameOpts, PersistenceAPI} from "@/game/room/types";
import * as assert from "assert";
import {ConsolePersistenceAPI} from "@/repositories/Game";
import {getConnection} from "typeorm";

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export function mockGameInitOpts(persister: PersistenceAPI): GameOpts {
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
    persister: new ConsolePersistenceAPI(getConnection())
  };
}