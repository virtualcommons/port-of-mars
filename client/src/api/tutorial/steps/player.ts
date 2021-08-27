import {BOTTOM, Step} from "@port-of-mars/client/types/tutorial";
import { RESEARCHER } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: ".tour-log",
    content: `Find more information about past Events, Accomplishment purchases, or Trades
             in the Mars Log.`,
    params: {
      placement: "top"
    },
    stateTransform: [
      {
        SET_INVESTMENT_COSTS: {
          data: {
            culture: Number.MAX_SAFE_INTEGER,
            finance: Number.MAX_SAFE_INTEGER,
            government: 3,
            legacy: 3,
            science: 2,
            systemHealth: 1
          },
          role: RESEARCHER
        },
        SET_VICTORY_POINTS: {
          data: 3,
          role: `Researcher`
        },

        // FIXME: fix mutation
        SET_ACTIVE_ACCOMPLISHMENTS: {
          data: {
            id: 1,
            role: "Researcher",
            label: "Interdisciplinary",
            flavorText: "You have more PhDs than most people have common sense.",
            science: 2,
            government: 1,
            legacy: 1,
            finance: 1,
            culture: 1,
            systemHealth: 0,
            victoryPoints: 5,
            effect: ""
          },
          role: `Researcher`
        }
      }
    ]
  },
  // {
  //   target: ".tour-player-self",
  //   content: `There are 5 roles in the Port of Mars: the Curator, Entrepreneur, Pioneer, Politician, and Researcher.
  //        In this tutorial you are the <b>Researcher</b>. Each role has a unique set of Influence Resources that
  //        they can earn and Accomplishments that they can purchase.`,
  //   params: {
  //     placement: RIGHT
  //   },
  //   stateTransform: [
  //     {
  //       SET_INVESTMENT_COSTS: {
  //         data: {
  //           culture: Number.MAX_SAFE_INTEGER,
  //           finance: Number.MAX_SAFE_INTEGER,
  //           government: 3,
  //           legacy: 3,
  //           science: 2,
  //           systemHealth: 1
  //         },
  //         role: RESEARCHER
  //       },
  //
  //       SET_VICTORY_POINTS: {
  //         data: 3,
  //         role: `Researcher`
  //       }
  //     }
  //   ]
  // },
  // {
  //   target: ".tour-hud-left-toggle",
  //   content: `The Other Players, Inventory, and Accomplishments icons at the bottom of this panel can
  //     be selected to quickly display additional information.`,
  //   params: {
  //     placement: BOTTOM
  //   },
  //   stateTransform: [
  //     {
  //       SET_INVESTMENT_COSTS: {
  //         data: {
  //           culture: Number.MAX_SAFE_INTEGER,
  //           finance: Number.MAX_SAFE_INTEGER,
  //           government: 3,
  //           legacy: 3,
  //           science: 2,
  //           systemHealth: 1
  //         },
  //         role: RESEARCHER
  //       },
  //       SET_VICTORY_POINTS: {
  //         data: 3,
  //         role: `Researcher`
  //       },
  //       SET_ACTIVE_ACCOMPLISHMENTS: {
  //         data: {
  //           id: 1,
  //           role: "Researcher",
  //           label: "Interdisciplinary",
  //           flavorText: "You have more PhDs than most people have common sense.",
  //           science: 2,
  //           government: 1,
  //           legacy: 1,
  //           finance: 1,
  //           culture: 1,
  //           systemHealth: 0,
  //           victoryPoints: 5,
  //           effect: ""
  //         },
  //         role: `Researcher`
  //       }
  //     }
  //   ]
  // },
  // {
  //   target: ".tour-hud-left-toggle",
  //   content: `The Other Players view shows your group's roles and scores.`,
  //   params: {
  //     placement: RIGHT
  //   },
  //   stateTransform: [
  //     {
  //       SET_HUDLEFT_VIEW: HUDLeftView.OtherPlayers
  //     },
  //     {
  //       SET_ACTIVE_ACCOMPLISHMENTS: {
  //         data: {
  //           id: 7,
  //           role: "Researcher",
  //           label: "Radiation Shielding",
  //           flavorText:
  //             "You discover a material that is more effective at shielding the habitats from radiation.",
  //           science: 1,
  //           government: 0,
  //           legacy: 0,
  //           finance: 4,
  //           culture: 0,
  //           systemHealth: 0,
  //           victoryPoints: 4,
  //           effect: ""
  //         },
  //         role: `Researcher`
  //       },
  //       PURCHASE_ACCOMPLISHMENT: {
  //         data: {
  //           id: 2,
  //           role: "Researcher",
  //           label: "Mars Helicopter",
  //           flavorText:
  //             "Your invention of a low gravity, low atmosphere, low-flying vehicle enables " +
  //             "greater exploration of the Martian surface.",
  //           science: 2,
  //           government: 0,
  //           legacy: 0,
  //           finance: 1,
  //           culture: 1,
  //           systemHealth: 0,
  //           victoryPoints: 3,
  //           effect: ""
  //         },
  //         role: `Researcher`
  //       }
  //     }
  //   ]
  // },
  // {
  //   target: ".tour-inventory-view",
  //   content: `The Inventory view lists your Influence Resources. You can earn Influence Resources by
  //     investing time blocks, trading with others, or from certain Events.`,
  //   params: {
  //     placement: RIGHT
  //   },
  //   stateTransform: [
  //     {
  //       SET_HUDLEFT_VIEW: HUDLeftView.Inventory
  //     }
  //   ]
  // },
  // {
  //   target: ".tour-hud-left-toggle",
  //   content: `These are the Accomplishments you can buy in the Purchase phase of this round <b>if you can afford them</b>.
  //     Different Accomplishments have different costs in Influence Resources or System Health and award different amounts of
  //     Victory Points.`,
  //   params: {
  //     placement: RIGHT
  //   },
  //   stateTransform: [
  //     {
  //       SET_HUDLEFT_VIEW: HUDLeftView.Accomplishments
  //     }
  //   ]
  // },
  // {
  //   target: ".tour-player-self",
  //   content: `Click on your own role to view your details and continue with the tutorial.`,
  //   params: {
  //     placement: RIGHT
  //   },
  //   stateTransform: [
  //     {
  //       required: true
  //     }
  //   ]
  // },
  // {
  //   target: ".tour-player-info-modal",
  //   content: `Your score, Influence Resources you have earned or collected, purchased Accomplishments,
  //     and Accomplishments available to purchase are accessible from this screen.`,
  //   params: {
  //     placement: RIGHT
  //   },
  //   stateTransform: [
  //     {
  //       SET_MODAL_VISIBLE: {
  //         type: "PlayerModal",
  //         data: {role: "Researcher"}
  //       }
  //     }
  //   ]
  // },
  // {
  //   target: ".tour-player-info-modal-stats",
  //   content: `Your player stats include your role, current score, and how your score compares with the other members of your group.`,
  //   params: {
  //     placement: "top"
  //   }
  // },
  // {
  //   target: ".tour-player-info-modal-inventory",
  //   content: `Your Inventory displays how many Influence Resources you currently own.`,
  //   params: {
  //     placement: LEFT
  //   }
  // },
  // {
  //   target: ".tour-player-info-modal-accomplishments",
  //   content: `These are the Accomplishments that you can purchase or have already purchased. You can have <b>up to
  //     three Accomplishments</b> available to purchase.`,
  //   params: {
  //     placement: RIGHT
  //   }
  // },
  // {
  //   target: ".tour-players",
  //   content: `These are the other four residents at the Port of Mars. Their scores and purchased accomplishments are public
  //       but their inventory is not, except under special circumstances.`,
  //   params: {
  //     placement: "RIGHT"
  //   },
  //   stateTransform: [
  //     {
  //       SET_PROFILE_MENU_VISIBILITY: false,
  //       SET_MODAL_HIDDEN: true,
  //       SET_HUDLEFT_VIEW: HUDLeftView.OtherPlayers
  //     }
  //   ]
  // },
];

export default steps;
