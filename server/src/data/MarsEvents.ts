import _ from 'lodash';
import { MarsEventData } from '@port-of-mars/shared/types';
import { getLogger } from '@port-of-mars/server/settings';

type MarsEventDeckItem = [MarsEventData, number];

const logger = getLogger(__filename);

const _marsEvents: Array<MarsEventDeckItem> = [
  [{
    id: 'changingTides',
    name: 'Changing Tides',
    effect: `Each player discards all of their available Accomplishments and draws 1 new Accomplishment. You will be able to discard this Accomplishment at the end of this round and draw up to three new Accomplishments at the start of the next round (if this is not the final round).`,
    flavorText: `Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1
  }, 1],
  [{
    id: 'personalGain',
    name: 'Personal Gain',
    effect: `Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 System Health.`,
    flavorText: `It's easy to take risks when others are incurring the costs.`,
    clientViewHandler: 'VOTE_YES_NO' as const,
    duration: 1
  }, 1],
  [{
    id: 'breakdownOfTrust',
    name: 'Breakdown of Trust',
    effect: `Each player chooses up to 2 Influences they own, then discards the rest.`,
    flavorText: `Setbacks are inevitable, but no less painful each time.`,
    clientViewHandler: 'INFLUENCES_SELECT' as const,
    duration: 1
  }, 1],
  [{
    id: 'bondingThroughAdversity',
    name: 'Bonding Through Adversity',
    effect: 'Each player gains one Influence of their choice.',
    flavorText: 'Challenges brings communities together.',
    clientViewHandler: 'INFLUENCES_DRAW' as const,
    duration: 1
  }, 1],
  [{
    id: 'compulsivePhilanthropy',
    name: 'Compulsive Philanthropy',
    effect: `Players must vote for one player to put all their Time Blocks into System Health this round.`,
    flavorText: `There's nothing quite like being volun-told for the greater good.`,
    clientViewHandler: 'VOTE_FOR_PLAYER_SINGLE' as const,
    duration: 1
  }, 1],
  [{
    id: 'heroOrPariah',
    name: 'Hero or Pariah',
    effect: `CHOOSE ONE:\n• Players must vote for 1 player to lose all Influence\n• Players must vote for 1 player to gain 4 of their specialty Influence`,
    flavorText: `In a community as small as Port of Mars, some individuals always stand out - for better or worse.`,
    clientViewHandler: 'VOTE_FOR_PLAYER_HERO_PARIAH' as const,
    duration: 1
  }, 1],
  [{
    id: 'audit',
    name: 'Audit',
    effect: `In this round, players will be able to view each other's accomplishments, inventories, resources and investment decisions.`,
    flavorText: `"Of course we trust everyone to be truthful. But it doesn't hurt to check now and again." - The Politician`,
    clientViewHandler: 'AUDIT' as const,
    duration: 1,
    timeDuration: 10,
  }, 1],
  [{
    id: 'effortsWasted',
    name: 'Efforts Wasted',
    effect: `Each player must discard an Accomplishment they purchased.`,
    flavorText: `"All markets are volatile. The trick is learning how to ride the waves." - The Entrepreneur`,
    clientViewHandler: 'ACCOMPLISHMENT_SELECT_PURCHASED' as const,
    duration: 1
  }, 1],
  [{
    id: 'marketsClosed',
    name: 'Markets Closed',
    effect: `Players may not trade Influences this round.`,
    flavorText: `"Trust is difficult to build and easy to break. Yet without it, this community would fall apart." - The Curator`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 10,
  }, 1],
  [{
    id: 'lifeAsUsual',
    name: 'Life as Usual',
    effect: 'No special effect',
    flavorText: `As the first human outpost on Mars, having a "usual" day is pretty unusual.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 10,
  }, 12],
  [{
    id: 'stymied',
    name: 'Stymied',
    effect: `Players may not earn their specialty Influence this round. (Culture for Curator, Business for Entrepreneur, Government for Politician, Science for researcher, Legacy for Pioneer)`,
    flavorText: `"That's very nice that you have three PhD's. Now pick up this toothbrush and help with cleaning our solar panel cells."`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 10,
  }, 1],
  [{
    id: 'lostTime',
    name: 'Lost Time',
    effect: `Each player has 5 fewer Time Blocks to spend this round.`,
    flavorText: `Time flies when you're trying to stay alive.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 10,
  }, 1],
  [{
    id: 'murphysLaw',
    name: "Murphy's Law",
    effect: `Reveal 2 more events. They're both in effect.`,
    flavorText: `Residents at Port of Mars know better than to ask, "what ELSE could go wrong?"`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 10,
  }, 1],
  [{
    id: 'sandstorm',
    name: 'Sandstorm',
    effect: `For the next 3 rounds, destroy an additional 10 System Health at the start of the round.`,
    flavorText: `Buckle in - things are about to get rough. And coarse. And irritating.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 3,
    timeDuration: 10,
  }, 1],
  [{
    id: 'cropFailure',
    name: 'Crop Failure',
    effect: `Destroy 20 System Health.`,
    flavorText: `"The good news is we're not eating any more potatoes this cycle! The bad news is we're not sure what we're eating." - The researcher`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 10,
  }, 1],
  [{
    id: 'hullBreach',
    name: 'Hull Breach',
    effect: `Destroy 7 System Health.`,
    flavorText: `"Accidents happen. It's unavoidable. Our job is to do our best to avoid them all the same."`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 10,
  }, 1],
  [{
    id: 'solarFlare',
    name: 'Solar Flare',
    effect: `Destroy 5 System Health. Skip discussion and trading phases this turn. Players cannot chat or trade Influences.`,
    flavorText: `Solar flares pose a far greater threat on Mars, where a thin atmosphere and non-existent magnetic field leaves settlers more vulnerable. `,
    clientViewHandler: 'DISABLE_CHAT' as const,
    duration: 1,
    timeDuration: 10,
  }, 1],
  [{
    id: 'interdisciplinary',
    name: 'Interdisciplinary',
    effect: `For this round, each player can spend 3 Time Blocks to earn an Influence in either of the 2 Influences they normally can't create.`,
    flavorText: `"Everyone knows the saying, 'Jack of all trades, master of none.' Few remember the second part: 'still better than a master of one.'" - The Pioneer`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 10,
  }, 1],
  [{
    id: 'outOfCommissionPolitician',
    name: 'Out of Commission',
    effect: 'The Politician receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 15,
  }, 1],
  [{
    id: 'outOfCommissionCurator',
    name: 'Out of Commission',
    effect: 'The Curator receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 15,
  }, 1],
  [{
    id: 'outOfCommissionResearcher',
    name: 'Out of Commission',
    effect: 'The Researcher receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 15,
  }, 1],
  [{
    id: 'outOfCommissionPioneer',
    name: 'Out of Commission',
    effect: 'The Pioneer receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 15,
  }, 1],
  [{
    id: 'outOfCommissionEntrepreneur',
    name: 'Out of Commission',
    effect: 'The Entrepreneur receives only 3 Time Blocks this round.',
    flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 15,
  }, 1],
  [{
    id: 'difficultConditions',
    name: 'Difficult Conditions',
    effect: `System Health costs twice as many Time Blocks as usual this round.`,
    flavorText: `When one component breaks, it puts a strain on the rest of the system. Small failures often snowball into critical ones.`,
    clientViewHandler: 'NO_CHANGE' as const,
    duration: 1,
    timeDuration: 15,
  }, 1]
];

export function getAllMarsEvents(): Array<MarsEventDeckItem> {
  const AVAILABLE_EVENTS = ['personalGain', 'sandstorm', 'compulsivePhilanthropy',
    'outOfCommissionCurator', 'outOfCommissionPolitician', 'outOfCommissionResearcher',
    'outOfCommissionPioneer', 'outOfCommissionEntrepreneur', 'audit', 'bondingThroughAdversity',
    'lifeAsUsual', 'breakdownOfTrust', 'changingTides'
  ];
  const availableEvents: Array<MarsEventDeckItem> = [];
  for (const eventId of AVAILABLE_EVENTS) {
    const marsEventDeckItem = _.find(_marsEvents, (ev: MarsEventDeckItem) => ev[0].id === eventId);
    if (marsEventDeckItem) {
      availableEvents.push(_.cloneDeep(marsEventDeckItem));
    }
    else {
      logger.warn("No event ID found in mars events: %s", eventId);
    }
  }
  return availableEvents;
}
