<template>
  <b-container fluid class="h-100">
    <b-row align-v="center" align-h="center" class="h-100 w-100 m-0 p-0 text-center">
      <b-col v-if="!decidedHeroOrPariah" :key="!decidedHeroOrPariah">
        <p class="title text-center">Select Hero or Pariah</p>
        <b-form class="text-center">
          <b-form-radio-group
            :options="options"
            :value="voteHeroOrPariah"
            @change="submitHeroOrPariah"
            button-variant="outline-warning"
            buttons
            size="lg"
          >
          </b-form-radio-group>
        </b-form>
        <p class="voted m-4" v-if="!decidedHeroOrPariah && voteHeroOrPariah">
          You voted for a <strong>{{ voteHeroOrPariah }}</strong
          >.
        </p>
        <b-spinner
          class="mx-auto"
          label="small spinner"
          small
          v-if="!decidedHeroOrPariah && voteHeroOrPariah"
        />
        <p class="voted m-2" v-if="!decidedHeroOrPariah && voteHeroOrPariah">
          Processing votes...
        </p>
      </b-col>
      <b-col v-if="decidedHeroOrPariah" :key="decidedHeroOrPariah">
        <!-- VOTE :: player to be hero or pariah -->
        <p class="title text-center">Select a {{ decidedHeroOrPariah }}</p>

        <!-- vote for player -->
        <div class="m-4">
          <div class="player-frame-container">
            <div
              :key="player"
              class="player-frame"
              v-bind:class="{ 'selected-background': player === role }"
              v-for="player in roles"
            >
              <img
                :src="require(`@port-of-mars/client/assets/characters/${player}.png`)"
                @click="selectRole(player)"
                alt="Player"
              />
            </div>
          </div>
          <p class="voted m-5" v-if="!role">No player selected.</p>
          <p class="voted m-5" v-else>
            <strong>{{ role }}</strong>
          </p>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { Role, ROLES } from "@port-of-mars/shared/types";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

@Component({})
export default class VoteHeroPariah extends Vue {
  @Inject() api!: GameRequestAPI;
  voteHeroOrPariah: "hero" | "pariah" | "" = "";
  role: Role | "" = "";

  options = [
    { text: "Hero", value: "hero" },
    { text: "Pariah", value: "pariah" }
  ];

  get decidedHeroOrPariah() {
    return this.$tstore.getters.heroOrPariah;
  }

  get roles(): Array<Role> {
    return ROLES;
  }

  submitHeroOrPariah(vote: "hero" | "pariah") {
    this.voteHeroOrPariah = vote;
    if (this.voteHeroOrPariah) {
      this.api.saveHeroOrPariah(this.voteHeroOrPariah);
    }
  }

  selectRole(member: Role): void {
    this.role = member;
    console.log("Hero or Pariah - Role Vote: ", this.role);
    this.api.saveHeroOrPariahRole(this.role);
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/events/views/VoteForPlayerHeroPariah.scss";
</style>
