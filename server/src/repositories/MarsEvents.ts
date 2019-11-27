import * as _ from 'lodash';
import {MarsEventData} from "shared/types";

export function getAllMarsEvents() {
  return marsEvents;
}

interface RawGameEvent extends Omit<MarsEventData, 'id'> {
  copies: number
}

const expandCopies = (rges: Array<RawGameEvent>) => _.flatMap(rges, (e: RawGameEvent) => {
  const copies = e.copies;
  const gameEvent: Omit<MarsEventData, 'id'> = {name: e.name, effect: e.effect, flavorText: e.flavorText};
  return _.map(_.range(copies), i => gameEvent);
});

const enumerate = (mes: Array<Omit<MarsEventData, 'id'>>) => _.map(mes, (x: Omit<MarsEventData, 'id'>, id: number) => ({ ...x, id }));

const marsEvents: Array<MarsEventData> = enumerate(expandCopies([
  {
    name: "Changing Tides",
    copies: 1,
    effect: `Each player discards all their Accomplishment cards and draws 1 new Accomplishment card. (They still draw up to a total of three cards at the end of this round.)`,
    flavorText: `Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.`
  },
  {
    name: 'Personal Gain',
    copies: 1,
    effect: `Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 Upkeep.`,
    flavorText: `It's easy to take risks when others are incurring the costs.`
  },
  {
    name: 'Breakdown of Trust',
    copies: 1,
    effect: `Each player chooses up to 2 Influence cards they own, then discards the rest.`,
    flavorText: `Setbacks are inevitable, but no less painful each time.`
  },
  {
    name: 'Bonding Through Adversity',
    copies: 1,
    effect: 'Each player gains one Influence of their choice.',
    flavorText: 'Challenges brings communities together.'
  },
  {
    name: 'Compulsive Philanthropy',
    copies: 1,
    effect: `Players must vote for one player to put all their Time Blocks into Upkeep this round.`,
    flavorText: `There's nothing quite like being volun-told for the greater good.`
  },
  {
    name: 'Hero or Pariah',
    copies: 1,
    effect: `CHOOSE ONE:
• Players must vote for 1 player to lose all Influence
• Players must vote for 1 player to gain 4 of their specialty Influence`,
    flavorText: `In a community as small as Port of Mars, some individuals always stand out - for better or worse.`
  },
  {
    name: 'Audit',
    copies: 1,
    effect: `For the next round, players play with dividers down. (Players can see how each other player allocates their time.)`,
    flavorText: `"Of course we trust everyone to be truthful. But it doesn't hurt to check now and again." - The Politician`
  },
  {
    name: 'Efforts Wasted',
    copies: 1,
    effect: `Each player must discard an Accomplishment they purchased.`,
    flavorText: `"All markets are volatile. The trick is learning how to ride the waves." - The Entrepreneur`
  },
  {
    name: 'Markets Closed',
    copies: 1,
    effect: `Players may not trade Influences this round.`,
    flavorText: `"Trust is difficult to build and easy to break. Yet without it, this community would fall apart." - The Curator`
  },
  {
    name: 'Life as Usual',
    copies: 12,
    effect: 'No special effect',
    flavorText: `As the first human outpost on Mars, having a "usual" day is pretty unusual.`
  },
  {
    name: 'Stymied',
    copies: 1,
    effect: `Players may not earn their specialty Influence this round. (Culture for Curator, Business for Entrepreneur, Government for Politician, Science for researcher, Legacy for Pioneer)`,
    flavorText: `"That's very nice that you have three PhD's. Now pick up this toothbrush and help with cleaning our solar panel cells."`
  },
  {
    name: 'Lost Time',
    copies: 1,
    effect: `Each player has 5 fewer Time Blocks to spend this round.`,
    flavorText: `Time flies when you're trying to stay alive.`
  },
  {
    name: 'Murphy\'s Law',
    copies: 1,
    effect: `Reveal 2 more events. They're both in effect.`,
    flavorText: `Residents at Port of Mars know better than to ask, "what ELSE could go wrong?"`
  },
  {
    name: 'Sandstorm',
    copies: 1,
    effect: `For the next 3 rounds, destroy an additional 10 Upkeep at the start of the round.`,
    flavorText: `Buckle in - things are about to get rough. And coarse. And irritating.`
  },
  {
    name: 'Crop Failure',
    copies: 1,
    effect: `Destroy 20 Upkeep.`,
    flavorText: `"The good news is we're not eating any more potatoes this cycle! The bad news is we're not sure what we're eating." - The researcher`
  },
  {
    name: 'Hull Breach',
    copies: 1,
    effect: `Destroy 7 Upkeep.`,
    flavorText: `"Accidents happen. It's unavoidable. Our job is to do our best to avoid them all the same."`
  },
  {
    name: 'Solar Flare',
    copies: 1,
    effect: `Destroy 5 Upkeep. Skip the discussion and trading phases this turn. (Players may not discuss how they allocate their time and may not trade Influences.)`,
    flavorText: `Solar flares pose a far greater threat on Mars, where a thin atmosphere and non-existent magnetic field leaves settlers more vulnerable. `
  },
  {
    name: 'Interdisciplinary',
    copies: 1,
    effect: `For this round, each player can spend 3 Time Blocks to earn an Influence in either of the 2 Influences they normally can't create.`,
    flavorText: `"Everyone knows the saying, 'Jack of all trades, master of none.' Few remember the second part: 'still better than a master of one.'" - The Pioneer`
  },
  {
    name: 'It Begins',
    copies: 1,
    effect: ``,
    flavorText: `Welcome to Port of Mars. Space is now open.`
  },
  {
    name: 'Out of Comission',
    copies: 1,
    effect: 'The Politician receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`
  },
  {
    name: 'Out of Commission',
    copies: 1,
    effect: 'The Politician receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`
  },
  {
    name: 'Out of Commission',
    copies: 1,
    effect: 'The Curator receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`
  },
  {
    name: 'Out of Commission',
    copies: 1,
    effect: 'The Researcher receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`
  },
  {
    name: 'Out of Commission',
    copies: 1,
    effect: 'The Pioneer receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`
  },
  {
    name: 'Out of Commission',
    copies: 1,
    effect: 'The Entrepreneur receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`
  },
  {
    name: 'Difficult Conditions',
    copies: 1,
    effect: `Upkeep costs twice as many Time Blocks as usual this round.`,
    flavorText: `When one component breaks, it puts a strain on the rest of the system. Small failures often snowball into critical ones.`
  }
]));