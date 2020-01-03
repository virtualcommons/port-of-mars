import {GameState, AccomplishmentSet, Player} from "@/game/state";
import {CURATOR, PIONEER, RESEARCHER} from "shared/types";
import {getAccomplishmentByID, getAccomplishmentIDs} from "@/repositories/Accomplishment";
import * as _ from 'lodash'

describe('a Researcher Player Accomplishment', () => {
  const repo = new AccomplishmentSet(RESEARCHER);
  const p = new Player(RESEARCHER);
  it('can be bought if their role matches', () => {
    const accomplishment = getAccomplishmentByID(RESEARCHER, 1);
    p.buyAccomplishment(accomplishment);
    expect(p.inventory.science).toBe(-accomplishment.science);
    expect(p.victoryPoints).toBe(accomplishment.victoryPoints);
  });

  it('cannot be bought if their roles do not match', () => {
    const accomplishment = getAccomplishmentByID(PIONEER, 21);
    const possibleAccomplishments = getAccomplishmentIDs(RESEARCHER);
    expect(possibleAccomplishments.includes(accomplishment.id)).toBe(false);
  });
});

describe('a player snaphot', () => {
  const p1 = new Player(RESEARCHER);
  const p2 = new Player(CURATOR);
  it('can be round tripped', () => {
    p2.fromJSON(p1.toJSON());
    expect(_.isEqual(p1, p2)).toBeTruthy();
  });
});

describe('a game state snapshot', () => {
  const g1 = new GameState();
  const g2 = new GameState();
  it('can be round tripped', () => {
    g2.fromJSON(g1.toJSON());
    expect(_.isEqual(g1, g2)).toBeTruthy();
    g2.maxRound = g1.maxRound + 1;
    expect(_.isEqual(g1, g2)).toBeFalsy()
  });
});

describe('an Event model', () => {
  it('can draw events based on upkeep level', () => {

  });
});

describe('an Effect', () => {
  it('can impact the game', () => {

  });
});