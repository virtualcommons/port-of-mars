import {Loader, Resolver} from "typeorm-fixtures-cli/dist";
import path from "path";
import _ from "lodash";
import {Role, ROLES} from "shared/types";

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export function mockGameInitOpts(): { [username: string]: Role } {
  const loader = new Loader();
  loader.load(path.resolve(__dirname, '../fixtures'));
  const fixtures = new Resolver().resolve(loader.fixtureConfigs);
  return _.zipObject(fixtures.filter(f => f.entity === 'User').map(f => f.data.username), ROLES);
}