<template>
  <b-container fluid class="h-100 m-0 p-0">
    <div class="background">
      <div id="manual" class="p-5">
        <h1 class="mb-4">Game Manual</h1>
        <b-row class="justify-content-around">
          <b-col sm="12" lg="6" class="pb-4">
            <div class="content-container p-3">
              <h4>The Game</h4>
              <p class="mb-0">
                You are 1 of 5 residents at the Port of Mars, the first long-term habitat on the
                planet. Each game consists of 8—12 rounds, each with phases of investing, trading,
                purchasing, discarding, and reacting to Mars events. Chance and player actions
                impact system health. If system health falls to zero all players die.
              </p>
            </div>
          </b-col>
          <b-col sm="12" lg="6" class="pb-4">
            <div class="content-container p-3">
              <h4>The Objective</h4>
              <p class="mb-0">
                Your mission is to stay alive and achieve the most Victory Points. In each round you
                will usually receive 10 time blocks that you can invest in System Health or
                Influence resources. System Health keeps your team alive. Influence resources are
                used to purchase Accomplishments that earn you Victory Points.
              </p>
            </div>
          </b-col>
        </b-row>
        <div class="content-container p-3 mb-4">
          <h4>Roles</h4>
          <p>
            Roles (Port of Mars residents, AKA characters) will be assigned randomly as the game
            begins.
          </p>
          <b-row class="m-2 justify-content-around">
            <b-col sm="6" lg="2">
              <b-badge variant="researcher" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Researcher</h4>
              </b-badge>
              <b-img
                fluid
                :src="$getAssetUrl(`images/character-Researcher.png`)"
                alt="Port of Mars character, the researcher, wears a purple suit and carries a transparent tablet"
              />
            </b-col>
            <b-col sm="6" lg="2">
              <b-badge variant="politician" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Politician</h4>
              </b-badge>
              <b-img
                fluid
                :src="$getAssetUrl(`images/character-Politician.png`)"
                alt="Port of Mars character, the Politician, wears a green suit with honorary sashes"
              />
            </b-col>
            <b-col sm="6" lg="2">
              <b-badge variant="pioneer" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Pioneer</h4>
              </b-badge>
              <b-img
                fluid
                :src="$getAssetUrl(`images/character-Pioneer.png`)"
                alt="Port of Mars character, the pioneer, wears a black suit with climbing equipment"
              />
            </b-col>
            <b-col sm="6" lg="2">
              <b-badge variant="entrepreneur" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Entrepreneur</h4>
              </b-badge>
              <b-img
                fluid
                :src="$getAssetUrl(`images/character-Entreprenuer.png`)"
                alt="Port of Mars character, the entrepreneur, wears a brown suit and looks at a transparent computer interface"
              />
            </b-col>
            <b-col sm="6" lg="2">
              <b-badge variant="curator" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Curator</h4>
              </b-badge>
              <b-img
                fluid
                :src="$getAssetUrl(`images/character-Curator.png`)"
                alt="Port of Mars character, the curator, wears a gray suit with a walking stick"
              />
            </b-col>
          </b-row>
        </div>
        <div class="content-container p-3 mb-4">
          <h4>Phases</h4>
          <p>
            A game consists of between 8 — 12 rounds with each round containing the following
            phases.
          </p>
          <div class="phase-block my-3 p-3">
            <h4><b-badge variant="primary">1</b-badge> New Round</h4>
            <p class="mb-0">
              Each new round is a summary of what occurred in the previous round. It will show what
              accomplishment cards were purchased, player investments made, and Mars events that
              contributed to system health.
            </p>
          </div>
          <div class="phase-block my-3 p-3">
            <h4><b-badge variant="primary">2</b-badge> Mars Events</h4>
            <p class="mb-0">
              The “chance” cards of the game. Players encounter a number of Mars events depending on
              system health level. They can positively or negatively impact players and the overall
              environment.
            </p>
          </div>
          <div class="phase-block my-3 p-3">
            <h4><b-badge variant="primary">3</b-badge> Invest</h4>
            <p class="mb-0">
              Invest time blocks into resources and/or system health. Typically, you will be able to
              allocate 10 time blocks, although this can increase or decrease due to active mars
              events.
            </p>
          </div>
          <div class="phase-block my-3 p-3">
            <h4><b-badge variant="primary">4</b-badge> Trade</h4>
            <p class="mb-0">
              Trade resources with other players. You can discuss and arrange trades using the
              in-game chat.
            </p>
          </div>
          <div class="phase-block my-3 p-3">
            <h4><b-badge variant="primary">5</b-badge> Purchase</h4>
            <p class="mb-0">
              Purchase accomplishment cards with collected resources. You will be able to see
              available accomplishments before this phase, so make sure to plan ahead!
            </p>
          </div>
          <div class="phase-block mt-3 p-3">
            <h4><b-badge variant="primary">6</b-badge> Discard</h4>
            <p class="mb-0">
              Discard any unwanted accomplishment cards that will be replaced at the start of the
              next round.
            </p>
          </div>
        </div>
        <div class="content-container p-3 mb-4">
          <h4>Resources</h4>
          <p>
            There are five different resource types in Port of Mars. These units can be acquired
            from Mars events, time blocks, are trades. Use them to purchase accomplishment cards
            which earns victory points.
          </p>
          <b-row class="m-2 justify-content-around">
            <b-col sm="6" lg="2">
              <b-badge variant="researcher" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Science</h4>
              </b-badge>
              <b-img
                center
                class="my-3"
                :src="$getAssetUrl(`images/icon-science.png`)"
                alt="circular blue background with a white lab beaker"
              />
            </b-col>
            <b-col sm="6" lg="2">
              <b-badge variant="politician" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Government</h4>
              </b-badge>
              <b-img
                center
                class="my-3"
                :src="$getAssetUrl(`images/icon-government.png`)"
                alt="circular red background with a white government building"
              />
            </b-col>
            <b-col sm="6" lg="2">
              <b-badge variant="pioneer" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Legacy</h4>
              </b-badge>
              <b-img
                center
                class="my-3"
                :src="$getAssetUrl(`images/icon-legacy.png`)"
                alt="circular purple background with a white moon with a flag"
              />
            </b-col>
            <b-col sm="6" lg="2">
              <b-badge variant="entrepreneur" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Finance</h4>
              </b-badge>
              <b-img
                center
                class="my-3"
                :src="$getAssetUrl(`images/icon-finance.png`)"
                alt="circular yellow background with three white coins"
              />
            </b-col>
            <b-col sm="6" lg="2">
              <b-badge variant="curator" class="d-flex justify-content-center">
                <h4 class="m-1 item-title">Culture</h4>
              </b-badge>
              <b-img
                center
                class="my-3"
                :src="$getAssetUrl(`images/icon-culture.png`)"
                alt="circular brown background with a white paintbrush"
              />
            </b-col>
          </b-row>
        </div>
        <div class="content-container p-3 mb-4">
          <h4>Glossary</h4>
          <b-row no-gutters>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Accomplishment Card</h4>
                <p class="mb-0">Purchased with resources and earns victory points</p>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Chat</h4>
                <p class="mb-0">Players can communicate to strategize</p>
              </div>
            </b-col>
            <!-- jkasdfjkasjkdfjk -->
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Inventory</h4>
                <p class="mb-0">Storage of resources owned by a player</p>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Investment</h4>
                <p class="mb-0">
                  Player’s allocation of time blocks into system health or resources
                </p>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Mars Event</h4>
                <p class="mb-0">
                  The “chance” card of the game, can positively or negatively impact the game.
                </p>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Mars Log</h4>
                <p class="mb-0">
                  Summarizes past events such as system health and accomplishment cards
                </p>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Phase</h4>
                <p class="mb-0">
                  Stages of a round- new round, Mars event, invest, trade, purchase, and discard
                </p>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Role</h4>
                <p class="mb-0">
                  Characters- Curator, Entrepreneur, Pioneer, Politician, Researcher
                </p>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Round</h4>
                <p class="mb-0">Each game consists of 8-12 rounds, each round consists of phases</p>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">System Health</h4>
                <p class="mb-0">
                  The condition of your environment in Port of Mars. If it falls to 0 all players
                  die.
                </p>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <div class="glossary-block m-2 p-3">
                <h4 class="item-title">Victory Points</h4>
                <p class="mb-0">Earned by a player from accomplishments</p>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

@Component({
  components: {
    Footer,
  },
})
export default class Manual extends Vue {}
</script>

<style lang="scss" scoped>
.background {
  background-color: rgba(45, 37, 36, 1);
}

#manual {
  max-width: 1200px;
  margin: auto;
}

.item-title {
  font-size: 1rem;
  color: var(--light-shade);
}

.phase-block {
  background-color: var(--color-Researcher);
  border-radius: 5px;
}

.glossary-block {
  height: 6.5rem;
  background-color: var(--color-Entrepreneur);
  border-radius: 5px;
}
</style>
