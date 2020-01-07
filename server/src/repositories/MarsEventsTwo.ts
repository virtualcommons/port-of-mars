import * as _ from 'lodash';
import {
  MarsEventDataTwo,
  EventServerActions,
  EventClientView,
  EventClientActions
} from 'shared/types';

export function getAllMarsEvents() {
  return marsEvents;
}

export function getMarsEventByID(id: number): MarsEventDataTwo | undefined {
  return _.find(marsEvents, me => me.id === id);
}

interface RawGameEvent extends Omit<MarsEventDataTwo, 'id'> {
  copies: number;
}

const expandCopies = (rges: Array<RawGameEvent>) =>
  _.flatMap(rges, (e: RawGameEvent) => {
    const copies = e.copies;
    const gameEvent: Omit<MarsEventDataTwo, 'id'> = {
      name: e.name,
      effectText: e.effectText,
      flavorText: e.flavorText,
      effects: e.effects,
      duration: e.duration
    };
    return _.map(_.range(copies), i => gameEvent);
  });

const enumerate = (mes: Array<Omit<MarsEventDataTwo, 'id'>>) =>
  _.map(mes, (x: Omit<MarsEventDataTwo, 'id'>, id: number) => ({ ...x, id }));

const marsEvents: Array<MarsEventDataTwo> = enumerate(
  expandCopies([
    {
      name: 'Changing Tides',
      copies: 1,
      effectText: `Each player discards all their Accomplishment cards and draws 1 new Accomplishment card. (They still draw up to a total of three cards at the end of this round.)`,
      flavorText: `Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.`,
      effects: {
        server: {
          actions: []
        },
        client: {
          // Maybe notify user in text box?
          view: [EventClientView.NO_CHANGE],
          // Make sure user can draw up to three accomplishment cards
          actions: [
            EventClientActions.PLAYER_DISCARD_ACCOMPLISHMENT_CARD_ALL,
            EventClientActions.PLAYER_DRAW_ACCOMPLISHMENT_CARD_ONE,
            EventClientActions.UPDATE_SERVER
          ]
        }
      },
      duration: 1
    },
    {
      name: 'Personal Gain',
      copies: 1,
      effectText: `Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 Upkeep.`,
      flavorText: `It's easy to take risks when others are incurring the costs.`,
      effects: {
        server: {
          actions: [EventServerActions.START_POLL_YES_NO, EventServerActions.ACTIONS_POLL_YES_NO]
        },
        client: {
          // Need to add timeblocks to user state?
          view: [EventClientView.VOTE_YES_NO],
          actions: [EventClientActions.PLAYER_COLLECT_VOTE, EventClientActions.PLAYER_SEND_VOTE]
        }
      },
      duration: 1
    },
    {
      name: 'Breakdown of Trust',
      copies: 1,
      effectText: `Each player chooses up to 2 Influence cards they own, then discards the rest.`,
      flavorText: `Setbacks are inevitable, but no less painful each time.`,
      effects: {
        server: {
          actions: []
        },
        client: {
          view: [EventClientView.INFLUENCES_SELECT],
          actions: [
            EventClientActions.PLAYER_SELECT_INFLUENCE_CARD_TWO,
            EventClientActions.PLAYER_DISCARD_INFLUENCE_CARD_ALL,
            EventClientActions.UPDATE_SERVER
          ]
        }
      },
      duration: 1
    },
    {
      name: 'Bonding Through Adversity',
      copies: 1,
      effectText: 'Each player gains one Influence of their choice.',
      flavorText: 'Challenges brings communities together.',
      effects: {
        server: {
          actions: []
        },
        client: {
          view: [EventClientView.INFLUENCES_DRAW],
          actions: [
            EventClientActions.PLAYER_DRAW_INFLUENCE_CARD_ONE,
            EventClientActions.UPDATE_SERVER
          ]
        }
      },
      duration: 1
    },
    {
      name: 'Compulsive Philanthropy',
      copies: 1,
      effectText: `Players must vote for one player to put all their Time Blocks into Upkeep this round.`,
      flavorText: `There's nothing quite like being volun-told for the greater good.`,
      effects: {
        server: {
          // Set player done to true or...
          actions: [EventServerActions.START_POLL_SINGLE, EventServerActions.ACTIONS_POLL_SINGLE]
        },
        client: {
          // Disable all investment buttons
          view: [EventClientView.VOTE_FOR_PLAYER_SINGLE],
          actions: [EventClientActions.PLAYER_COLLECT_VOTE, EventClientActions.PLAYER_SEND_VOTE]
        }
      },
      duration: 1
    },
    {
      name: 'Hero or Pariah',
      copies: 1,
      effectText: `CHOOSE ONE:
• Players must vote for 1 player to lose all Influence
• Players must vote for 1 player to gain 4 of their specialty Influence`,
      flavorText: `In a community as small as Port of Mars, some individuals always stand out - for better or worse.`,
      effects: {
        server: {
          actions: [
            EventServerActions.START_POLL_HERO_PARIAH,
            EventServerActions.ACTIONS_POLL_HERO_PARIAH
          ]
        },
        client: {
          view: [EventClientView.VOTE_FOR_PLAYER_HERO_PARIAH],
          actions: [
            EventClientActions.PLAYER_COLLECT_VOTE,
            EventClientActions.PLAYER_SEND_VOTE,
            EventClientActions.UPDATE_SERVER
          ]
        }
      },
      duration: 1
    },
    {
      name: 'Audit',
      copies: 1,
      effectText: `For the next round, players play with dividers down. (Players can see how each other player allocates their time.)`,
      flavorText: `"Of course we trust everyone to be truthful. But it doesn't hurt to check now and again." - The Politician`,
      effects: {
        server: {
          actions: []
        },
        client: {
          view: [EventClientView.AUDIT],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Efforts Wasted',
      copies: 1,
      effectText: `Each player must discard an Accomplishment they purchased.`,
      flavorText: `"All markets are volatile. The trick is learning how to ride the waves." - The Entrepreneur`,
      effects: {
        server: {
          actions: []
        },
        client: {
          view: [EventClientView.ACCOMPLISHMENT_SELECT_PURCHASED],
          actions: [
            EventClientActions.PLAYER_DISCARD_PURCHASED_ACCOMPLISHMENT_CARD_ONE,
            EventClientActions.UPDATE_SERVER
          ]
        }
      },
      duration: 1
    },
    {
      name: 'Markets Closed',
      copies: 1,
      effectText: `Players may not trade Influences this round.`,
      flavorText: `"Trust is difficult to build and easy to break. Yet without it, this community would fall apart." - The Curator`,
      effects: {
        server: {
          actions: [EventServerActions.SKIP_PHASE_TRADING]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Life as Usual',
      copies: 12,
      effectText: 'No special effect',
      flavorText: `As the first human outpost on Mars, having a "usual" day is pretty unusual.`,
      effects: {
        server: {
          actions: []
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Stymied',
      copies: 1,
      effectText: `Players may not earn their specialty Influence this round. (Culture for Curator, Business for Entrepreneur, Government for Politician, Science for researcher, Legacy for Pioneer)`,
      flavorText: `"That's very nice that you have three PhD's. Now pick up this toothbrush and help with cleaning our solar panel cells."`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_SPECIALTY_COST_BLOCKED]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Lost Time',
      copies: 1,
      effectText: `Each player has 5 fewer Time Blocks to spend this round.`,
      flavorText: `Time flies when you're trying to stay alive.`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_TIMEBLOCKS_MINUS_FIVE]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: "Murphy's Law",
      copies: 1,
      effectText: `Reveal 2 more events. They're both in effect.`,
      flavorText: `Residents at Port of Mars know better than to ask, "what ELSE could go wrong?"`,
      effects: {
        server: {
          actions: [EventServerActions.ADD_EVENT_TWO]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Sandstorm',
      copies: 1,
      effectText: `For the next 3 rounds, destroy an additional 10 Upkeep at the start of the round.`,
      flavorText: `Buckle in - things are about to get rough. And coarse. And irritating.`,
      effects: {
        server: {
          actions: [EventServerActions.GLOBAL_MODIFY_UPKEEP_MINUS_TEN]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 3
    },
    {
      name: 'Crop Failure',
      copies: 1,
      effectText: `Destroy 20 Upkeep.`,
      flavorText: `"The good news is we're not eating any more potatoes this cycle! The bad news is we're not sure what we're eating." - The researcher`,
      effects: {
        server: {
          actions: [EventServerActions.GLOBAL_MODIFY_UPKEEP_MINUS_TWENTY]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Hull Breach',
      copies: 1,
      effectText: `Destroy 7 Upkeep.`,
      flavorText: `"Accidents happen. It's unavoidable. Our job is to do our best to avoid them all the same."`,
      effects: {
        server: {
          actions: [EventServerActions.GLOBAL_MODIFY_UPKEEP_MINUS_SEVEN]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Solar Flare',
      copies: 1,
      effectText: `Destroy 5 Upkeep. Skip the discussion and trading phases this turn. (Players may not discuss how they allocate their time and may not trade Influences.)`,
      flavorText: `Solar flares pose a far greater threat on Mars, where a thin atmosphere and non-existent magnetic field leaves settlers more vulnerable. `,
      effects: {
        server: {
          actions: [
            EventServerActions.GLOBAL_MODIFY_UPKEEP_MINUS_FIVE,
            EventServerActions.SKIP_PHASE_TRADING
          ]
        },
        client: {
          view: [EventClientView.DISABLE_CHAT],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Interdisciplinary',
      copies: 1,
      effectText: `For this round, each player can spend 3 Time Blocks to earn an Influence in either of the 2 Influences they normally can't create.`,
      // LANGUAGE: EITHER?
      flavorText: `"Everyone knows the saying, 'Jack of all trades, master of none.' Few remember the second part: 'still better than a master of one.'" - The Pioneer`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_DISABLED_COST_THREE]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'It Begins',
      copies: 1,
      effectText: ``,
      flavorText: `Welcome to Port of Mars. Space is now open.`,
      effects: {
        server: {
          actions: []
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    // DUPLICATES?
    {
      name: 'Out of Comission',
      copies: 1,
      effectText: 'The Politician receives only 3 Time Blocks this round.',
      flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_TIMEBLOCKS_EQUALS_THREE]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    // DUPLICATES?
    {
      name: 'Out of Commission',
      copies: 1,
      effectText: 'The Politician receives only 3 Time Blocks this round.',
      flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_TIMEBLOCKS_EQUALS_THREE]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Out of Commission',
      copies: 1,
      effectText: 'The Curator receives only 3 Time Blocks this round.',
      flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_TIMEBLOCKS_EQUALS_THREE]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Out of Commission',
      copies: 1,
      effectText: 'The Researcher receives only 3 Time Blocks this round.',
      flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_TIMEBLOCKS_EQUALS_THREE]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Out of Commission',
      copies: 1,
      effectText: 'The Pioneer receives only 3 Time Blocks this round.',
      flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_TIMEBLOCKS_EQUALS_THREE]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Out of Commission',
      copies: 1,
      effectText: 'The Entrepreneur receives only 3 Time Blocks this round.',
      flavorText: `The mental and physical health of all residents is critical to mission success. The absence of even one person can have rippling effects on the community.`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_TIMEBLOCKS_EQUALS_THREE]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    },
    {
      name: 'Difficult Conditions',
      copies: 1,
      effectText: `Upkeep costs twice as many Time Blocks as usual this round.`,
      flavorText: `When one component breaks, it puts a strain on the rest of the system. Small failures often snowball into critical ones.`,
      effects: {
        server: {
          actions: [EventServerActions.PLAYER_MODIFY_TIMEBLOCKS_EQUALS_THREE]
        },
        client: {
          view: [EventClientView.NO_CHANGE],
          actions: []
        }
      },
      duration: 1
    }
  ])
);
