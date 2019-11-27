import {Player} from "@/rooms/Game";
import {AccomplishmentSet} from "@/state";

describe('a Player', () => {
  const repo = new AccomplishmentSet();
  const p = new Player('pioneer');
  it('can buy a Pioneer accomplishment', () => {
    const accomplishment = getByID('pioneer', 1);
    p.buy(accomplishment);
  });

  it('cannot buy a Researcher accomplishment', () => {

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