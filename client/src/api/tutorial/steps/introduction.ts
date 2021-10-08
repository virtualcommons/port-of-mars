import { Step, LEFT } from "@port-of-mars/client/types/tutorial";
import { ServerRole, RESEARCHER } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: ".tour-phase",
    content: `Information on the current state of the Port of Mars is always displayed here.`,
    params: {
      placement: LEFT
    }
  },
  {
    target: ".tour-chat",
    content: `Use chat to communicate with players during the game.
      Send a chat message to continue.`,
    params: {
      placement: LEFT
    },
    stateTransform: [
      {
        SET_LAYOUT: "tutorial",
        required: true,
        ADD_TO_PURCHASABLE_ACCOMPLISHMENTS: {
          data: {
            id: 2,
            role: "Researcher",
            label: "Mars Helicopter",
            flavorText:
              "Your invention of a low gravity, low atmosphere, low-flying vehicle enables " +
              "greater exploration of the Martian surface.",
            science: 2,
            government: 0,
            legacy: 0,
            finance: 1,
            culture: 1,
            systemHealth: 0,
            victoryPoints: 3,
            effect: ""
          },
          role: RESEARCHER
        }
      },
      {
        ADD_TO_PURCHASABLE_ACCOMPLISHMENTS: {
          data: {
            id: 7,
            role: "Researcher",
            label: "Radiation Shielding",
            flavorText:
              "You discover a material that is more effective at shielding the habitats from radiation.",
            science: 1,
            government: 0,
            legacy: 0,
            finance: 4,
            culture: 0,
            systemHealth: 0,
            victoryPoints: 4,
            effect: ""
          },
          role: `Researcher`
        }
      },
      {
        ADD_TO_PURCHASABLE_ACCOMPLISHMENTS: {
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
          role: RESEARCHER
        }
      }
    ]
  }
];

export default steps;
