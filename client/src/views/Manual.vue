<template>
  <b-container fluid class="h-100 m-0 p-0 background">
    <Header></Header>
    <!-- Gameplay -->
    <section id="gameplay" class="p-2 m-4">
      <h1 class="section-title text-center m-2">Gameplay</h1>
      <b-row class="gameplay justify-content-around">
        <b-col sm="12" lg="5" id="the-game" class="gameplay-box p-3 my-4">
          <h2 class="box-title">The Game</h2>
          <p>
            You are 1 of 5 residents at the Port of Mars, the first long-term habitat on the planet.
            Each game consists of 8—12 rounds, each with phases of investing, trading, purchasing,
            discarding, and reacting to Mars events. Chance and player actions impact system health.
            If system health falls to zero all players die.
          </p>
        </b-col>
        <b-col sm="12" lg="2"></b-col>
        <b-col sm="12" lg="5" id="the-objectives" class="gameplay-box p-3 my-4">
          <h2 class="box-title">The Objective</h2>
          <p>
            Your mission is to stay alive and achieve the most victory points. Each round you
            receive 10 time blocks that you can invest in system health or accomplishments. System
            health will maintain the shared infrastructure (upkeep) and keep the team alive.
            Accomplishments will earn you victory points.
          </p>
        </b-col>
      </b-row>
    </section>
    <!-- Roles -->
    <section id="the-roles" class="roles p-2 m-4">
      <h2 class="box-title m-2">The Roles</h2>
      <p class="m-2 p-1">
        Roles (Port of Mars residents, AKA characters) will be assigned randomly as the game begins.
      </p>
      <b-row class="m-2 justify-content-around">
        <b-col lg="2">
          <h4 class="role-title">Researcher</h4>
          <b-img
            v-bind="roleProps"
            :src="require(`@port-of-mars/client/assets/images/character-Researcher.png`)"
            alt="Port of Mars character, the researcher, wears a purple suit and carries a transparent tablet"
          />
        </b-col>
        <b-col sm="10" lg="2">
          <h4 class="role-title">Politician</h4>
          <b-img
            v-bind="roleProps"
            :src="require(`@port-of-mars/client/assets/images/character-Politician.png`)"
            alt="Port of Mars character, the Politician, wears a green suit with honorary sashes"
          />
        </b-col>
        <b-col sm="10" lg="2">
          <h4 class="role-title">Pioneer</h4>
          <b-img
            v-bind="roleProps"
            :src="require(`@port-of-mars/client/assets/images/character-Pioneer.png`)"
            alt="Port of Mars character, the pioneer, wears a black suit with climbing equipment"
          />
        </b-col>
        <b-col sm="10" lg="2">
          <h4 class="role-title">Entrepreneur</h4>
          <b-img
            v-bind="roleProps"
            :src="require(`@port-of-mars/client/assets/images/character-Entreprenuer.png`)"
            alt="Port of Mars character, the entrepreneur, wears a brown suit and looks at a transparent computer interface"
          />
        </b-col>
        <b-col sm="10" lg="2">
          <h4 class="role-title">Curator</h4>
          <b-img
            v-bind="roleProps"
            :src="require(`@port-of-mars/client/assets/images/character-Curator.png`)"
            alt="Port of Mars character, the curator, wears a gray suit with a walking stick"
          />
        </b-col>
      </b-row>
    </section>
    <!-- Phases -->
    <section id="the-phases" class="phases p-2 m-4">
      <h2 class="box-title m-2">The Phases</h2>
      <p class="m-2 p-1">
        A game consists of between 8 — 12 rounds and each round consists of the following phases.
      </p>
      <b-row class="justify-content-around">
        <b-col sm="10" md="5" lg="3" class="phase-box p-3 my-4">
          <h4>New Round</h4>
          <p>
            Each new round is a summary of what occurred in the previous round. It will show what
            accomplishment cards were purchased, player investments made, and Mars events that
            contributed to system health.
          </p>
        </b-col>
        <b-col sm="10" md="5" lg="3" class="phase-box p-3 my-4">
          <h4>Mars Event</h4>
          <p>
            The “chance” card of the game. Players encounter a number of Mars events depending on
            system health level. They can positively or negatively impact players and the overall
            environment.
          </p>
        </b-col>
        <b-col sm="10" md="5" lg="3" class="phase-box p-3 my-4">
          <h4>Investment</h4>
          <p>Invest time blocks into resources and/or system health.</p>
        </b-col>
        <b-col sm="10" md="5" lg="3" class="phase-box p-3 my-4">
          <h4>Trade</h4>
          <p>Trade resources to purchase accomplishment cards.</p>
        </b-col>
        <b-col sm="10" md="5" lg="3" class="phase-box p-3 my-4">
          <h4>Purchase</h4>
          <p>Purchase accomplishment cards to earn points.</p>
        </b-col>
        <b-col sm="10" md="5" lg="3" class="phase-box p-3 my-4">
          <h4>Discard</h4>
          <p>Discard unwanted accomplishment cards for new ones in the next round.</p>
        </b-col>
      </b-row>
    </section>
    <!-- Resources -->
    <section id="the-resources" class="resources p-2 m-4">
      <h2 class="box-title">The Resources</h2>
      <p>
        There are five different resource types in Port of Mars. These units can be acquired from
        Mars events, time blocks, are trades. Use them to purchase accomplishment cards which earns
        victory points.
      </p>
      <b-row class="m-2 justify-content-around">
        <b-col lg="2">
          <h4 class="resource-title">Science</h4>
          <b-img
            v-bind="resourceProps"
            :src="require(`@port-of-mars/client/assets/images/icon-science.png`)"
            alt="circular blue background with a white lab beaker"
          />
        </b-col>
        <b-col sm="10" lg="2">
          <h4 class="resource-title">Finance</h4>
          <b-img
            v-bind="resourceProps"
            :src="require(`@port-of-mars/client/assets/images/icon-finance.png`)"
            alt="circular yellow background with three white coins"
          />
        </b-col>
        <b-col sm="10" lg="2">
          <h4 class="resource-title">Legacy</h4>
          <b-img
            v-bind="resourceProps"
            :src="require(`@port-of-mars/client/assets/images/icon-legacy.png`)"
            alt="circular purple background with a white moon with a flag"
          />
        </b-col>
        <b-col sm="10" lg="2">
          <h4 class="resource-title">Government</h4>
          <b-img
            v-bind="resourceProps"
            :src="require(`@port-of-mars/client/assets/images/icon-government.png`)"
            alt="circular red background with a white government building"
          />
        </b-col>
        <b-col sm="10" lg="2">
          <h4 class="resource-title">Culture</h4>
          <b-img
            v-bind="resourceProps"
            :src="require(`@port-of-mars/client/assets/images/icon-culture.png`)"
            alt="circular brown background with a white paintbrush"
          />
        </b-col>
      </b-row>
    </section>
    <!-- Glossary -->
    <section id="the-glossary" class="glossary p-2 m-4">
      <h2 class="box-title">The Glossary</h2>
      <b-row class="m-2 justify-content-around">
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4 class="glossary-title">Accomplishment Card</h4>
          <p>Purchased with resources and earns victory points</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4 class="glossary-title">Chat</h4>
          <p>Players can communicate to strategize</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>Inventory</h4>
          <p>Storage of resources owned by a player</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>Investment</h4>
          <p>Player’s allocation of time blocks into system health or resources</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>Mars Event</h4>
          <p>The “chance” card of the game, can positively or negatively impact the game.</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>Mars Log</h4>
          <p>Summarizes past events such as system health and accomplishment cards</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>Phase</h4>
          <p>Stages of a round- new round, Mars event, invest, trade, purchase, and discard</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>Role</h4>
          <p>Characters- Curator, Entrepreneur, Pioneer, Politician, Researcher</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>Round</h4>
          <p>Each game consists of 8-12 rounds, each round consists of phases</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>Resource</h4>
          <p>Assets- culture, finance, government, legacy, science</p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>System Health</h4>
          <p>
            The condition of your environment in Port of Mars. If it falls to 0 all players die.
          </p>
        </b-col>
        <b-col class="glossary-box p-3 my-4" sm="10" md="5" lg="3">
          <h4>Victory Points</h4>
          <p>Earned by a player from accomplishments</p>
        </b-col>
      </b-row>
    </section>
    <Footer></Footer>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Header from "@port-of-mars/client/components/global/Header.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
@Component({
  components: {
    Footer,
    Header
  }
})
export default class Manual extends Vue {
  roleProps = {
    center: true,
    blankColor: "#bbb",
    maxHeight: 100,
    maxWidth: 100
  };

  resourceProps = {
    center: true,
    width: 100,
    height: 100
  };
}
</script>

<style>
.background {
  background-color: var(--brown);
}

.gameplay {
  background-color: var(--brown);
  padding: 1rem;
  background: url("/assets/images/bg-dark-moon.png");
}

.gameplay-box,
.phases,
.glossary {
  background-color: var(--yellow);
  color: var(--black);
}

.section-title {
  color: var(--white);
  text-transform: uppercase;
  font-weight: bold;
  font-size: 2em;
}

.box-title {
  font-style: italic;
  font-weight: bolder;
  font-size: 2em;
  color: var(--black);
}

.roles,
.resources {
  background-color: var(--beige);
  color: var(--black);
}

.role-title,
.resource-title {
  text-transform: uppercase;
  font-size: 1.5em;
  font-weight: bolder;
  text-align: center;
}

.phase-box,
.glossary-box {
  background-color: var(--white);
  color: var(--black);
  border: 1px solid var(--black);
  margin: 0 3% 3% 0;
  line-height: 1.5em;
  font-size: 1.25em;
}
</style>
