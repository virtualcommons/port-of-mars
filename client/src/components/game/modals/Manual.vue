<template>
  <b-container fluid no-gutters class="h-100">
    <b-row class="w-100">
      <b-col cols="8">
        <h1>Glossary</h1>
    <h3>Accomplishment Card</h3>
    <p>Can be purchased by resources and contribute to a players victory points.</p>

    <h3>Chat</h3>
    <p>Players can chat with one another in the chat box.</p>

    <h3>Inventory</h3>
    <p>A player's inventory is the number of units of culture, government, finance, legacy and science they possess.</p>

    <h3>Investment</h3>
    <p>The number of units of culture, government, finance, legacy, science and system health that a player allocated using their timeblocks in the investment phase.</p>

    <h3>Mars Event</h3>
    <p>A phenomenon that occurs in the Mars Event phase of the game. It may require players to take some action (such as vote), or it may just be message describing how the environment on Mars has changed. If System Health is low, additional Mars events occur in a given round.</p>

    <h3>Mars Log</h3>
    <p>Summarizes the events that have occurred over the course of the game such as contributions to system health and what accomplishment cards have been purchased.</p>

    <h3>Phase</h3>
    <p>The stage a round of a game is in. See the game phase section for details.</p>

    <h3>Resource</h3>
    <p>An asset type. There are five different resource types in Port of Mars:
      <ul>
        <li>culture</li>
        <li>finance</li>
        <li>government</li>
        <li>legacy</li>
        <li>science</li>
      </ul>
      Units of a resource can be acquired from Mars events, time blocks allocations in the investment phase and trade in the trade phase.
    </p>

    <h3>Role</h3>
    <p>The class of character the player plays as. There are five player classes in Port of Mars: 
      <ul>
        <li>Curator</li>
        <li>Entrepreneur</li>
        <li>Pioner</li>
        <li>Politician</li>
        <li>Researcher</li>
      </ul>
      with different characteristics.
    </p>

    <h3>Round</h3>
    <p>The number of full investment, trade, purchase, discard, Mars event cycles a player has currently completed or is underway in. A game in Port of Mars consists of between eight and twelve rounds - the exact number is unknown to all players.</p>

    <h3>System Health</h3>
    <p>System health describes the condition of your environment in Port of Mars. System health at 100 and if it falls to zero all players die.</p>

    <h3>Tournament</h3>
    <p>A contest. Games in Port of Mars are part of a tournament. Players that play in one round of a tournament may advance to subsequent tournament rounds based on their invitation rules.</p>

    <h3>Victory Points</h3>
    <p>The level of personal accomplishment a player has achieved through the purchase of accomplishment cards or by other means.</p>
  
    <h1>Game</h1>
    <p>The level of personal accomplishment a player has achieved through the purchase of accomplishment cards or by other means.</p>

    <h1>Phases</h1>
    <h2>New Round</h2>
    <p>The new round phase is a summary of what occurred in the previous round. It shows what accomplishment card purchases, player investments and Mars events contributed to system health in the previous round. It also what accomplishment cards a player purchased.</p>

    <h2>Investment</h2>
    <p>In the investment phase players decide how to invest their time in acquiring resources. A can invest time blocks into culture, finance, government, legacy, science and system health without a different time blocks cost for each resource type. Investment into units of system health contribute to the overall system health on Mars. Investment into other resource types can be used for trade and the purchase of accomplishment cards which provide the player with victory points.</p>

    <h2>Trade</h2>
    <p>In the trade phase players can trade resources with one another in order to purchase accomplishment cards at a later date. Since each player has different investment costs for a particular resource player can produce resources faster if they produce what they have comparative advantage in.</p>

    <h2>Purchase</h2>
    <p>In the purchase phase players can purchase accomplishment cards which give players victory points. When a player purchases an accomplishment card it is visible in the Mars log along with any side effects that purchase has on the shared Martian environment.</p>

    <h2>Discard</h2>
    <p>In the discard phase players can discard any purchasable accomplishment cards (accomplishment cards that they have not purchased but could). In the new round phase new random accomplishment cards will be added to the list of purchasable accomplishment cards to replace the ones the player discarded.</p>

    <h1>Rounds</h1>
    <p>A game in Port of Mars consists of between eight and twelve rounds. The exact number of rounds is unknown to the player.</p>
      </b-col>
      <b-col cols="4">
        Summary List Here
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default class Manual extends Vue {

  // may use pagination 
  pages: [
    { link: "?page=1"; text: "One" },
    { link: "?page=2"; text: "Two" },
    { link: "?page=3"; text: "Three" }
  ];
}
</script>

<style scoped lang="scss"></style>
