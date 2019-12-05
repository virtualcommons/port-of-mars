import {GameState, AccomplishmentSet, Player} from "@/state";
import {PIONEER, RESEARCHER} from "shared/types";
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
