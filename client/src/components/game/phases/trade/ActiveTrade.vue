<template>
  <b-container
    fluid
    :class="!active ? 'mb-2 p-0 hide-trade' : 'mb-2 p-0 backdrop'"
    :style="statusColor('borderColor')"
    style="border: .125rem solid"
    v-show="show"
  >
    <!-- header -->
    <b-row class="h-auto w-100 mx-auto">
      <p
        v-if="active"
        class="w-100 text-center p-1"
        :style="[textColor, statusColor('backgroundColor')]"
      >
        New Trade Request
      </p>
      <p v-else class="w-100 text-center p-1" :style="[textColor, statusColor('backgroundColor')]">
        Trade {{ status }}
      </p>
    </b-row>
    <!-- trade info -->
    <b-row align-h="around" align-v="center" class="h-auto w-100 mx-3">
      <!-- from -->
      <b-col cols="auto" class="w-50">
        <b-row align-h="start" align-v="center" class="w-100" :style="frameStyle(sender.role)">
          <b-img
            v-bind="player"
            :src="require(`@port-of-mars/client/assets/characters/${sender.role}.png`)"
            :alt="sender.role"
          />
          <p>{{ sender.role }} offers</p>
        </b-row>

        <b-row align-h="around" class="w-100 my-1 backdrop">
          <b-col :key="name" v-for="(value, name) in sender.resourceAmount" class="pt-2">
            <b-img
              v-bind="investment"
              :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
              :alt="name"
              :title="name"
              v-b-tooltip.hover.bottom
            />
            <p class="text-center my-2">{{ value }}</p>
          </b-col>
        </b-row>
      </b-col>

      <!-- to -->
      <b-col cols="auto" class="w-50">
        <b-row align-h="end" align-v="center" class="w-100" :style="frameStyle(recipient.role)">
          <p>In exchange for</p>
          <b-img
            v-bind="player"
            :src="require(`@port-of-mars/client/assets/characters/${recipient.role}.png`)"
            :alt="recipient.role"
          />
        </b-row>
        <b-row align-h="around" class="w-100 my-1 backdrop">
          <b-col :key="name" v-for="(value, name) in recipient.resourceAmount" class="pt-2">
            <b-img
              v-bind="investment"
              :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
              :alt="name"
              :title="name"
              v-b-tooltip.hover.bottom
            />
            <span class="text-center my-2">{{ value }}</span>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- buttons / trade request status -->
    <b-row class="h-auto w-100 mx-0 my-2 text-center">
      <!-- accept or reject -->
      <b-col v-if="active">
        <b-button-group v-if="role === recipient.role && role !== sender.role">
          <b-button
            squared
            variant="success"
            :disabled="!hasSufficientResources || playerReady"
            @click="handleAcceptTrade"
            >Accept</b-button
          >
          <b-button squared variant="danger" :disabled="playerReady" @click="handleTradeReject">
            Reject
          </b-button>
        </b-button-group>
        <b-button
          v-if="role === sender.role && role !== recipient.role"
          :disabled="playerReady"
          @click="handleTradeCancel"
          variant="danger"
          squared
        >
          Cancel
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { RESOURCES, Role, TradeAmountData } from "@port-of-mars/shared/types";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons/faExchangeAlt";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { canPlayerMakeTrade } from "@port-of-mars/shared/validation";

library.add(faExchangeAlt);
library.add(faTimes);
library.add(faCheck);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({})
export default class ActiveTrade extends Vue {
  @Inject() api!: GameRequestAPI;
  // sender: who sent the trade
  @Prop() sender!: TradeAmountData;
  // recipient: who is receiving the trade
  @Prop() recipient!: TradeAmountData;
  //id on the trade
  @Prop() id!: string;
  //status of the trade -> 'Active' | 'Accepted' | 'Cancelled' | 'Rejected'
  @Prop() status!: string;
  //degree of participation -> 1 | 0 | -1
  @Prop() participant!: number;

  //internal state for whether or not the trade should be shown
  //show is the root element dictates whether or not the trade should be shown
  show = true;

  //active dictates what animation should be playing
  active = true;

  investment = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 30,
    height: 30
  };

  player = {
    fluid: true,
    blankColor: "#bbb",
    width: 100,
    height: 100
  };

  get role() {
    return this.$tstore.state.role;
  }

  get playerReady() {
    return this.$tstore.getters.player.ready;
  }

  get hasSufficientResources() {
    // retrieve local player's inventory
    const inventory = this.$store.state.players[this.role].inventory;
    let validTrade: boolean = canPlayerMakeTrade(this.recipient.resourceAmount, inventory);

    if (this.role === this.recipient.role) {
      console.log(
        "canPlayerMakeTrade if you are recipient: ",
        canPlayerMakeTrade(this.recipient.resourceAmount, inventory)
      );
      return validTrade;
    }
  }

  // color code text based on trade status
  get textColor() {
    console.log(this.status);
    if (this.status != "Active") {
      return { color: "white" };
    }

    return { color: `var(--dark-shade)` };
  }

  mounted() {
    // on trade mount, hide the trade if it is already inactive
    if (this.status != "Active") {
      this.active = false;
      this.show = false;
    }
  }

  // watch for trade status changes
  @Watch("status", { immediate: true })
  watchTrade(status: string) {
    console.log({ status });
    if (status != "Active") {
      // start hide animation on the trade
      this.active = false;
      // set the trade to hidden after x milliseconds
      setTimeout(() => (this.show = false), 5000);
    }
  }

  // color of the trade header and trade background
  statusColor(type: string) {
    // default color: white
    let color: string = "var(--light-shade)";

    // if player is involved with the trade, color = orange
    if (this.participant == 1 || this.participant == 0) {
      color = "var(--light-accent)";
    }

    // alternate statuses supersede involvement
    if (this.status == "Accepted") {
      color = "var(--green)";
    } else if (this.status == "Cancelled" || this.status == "Rejected") {
      color = "var(--red)";
    }

    //map to whatever type was passed in
    return { [type]: color };
  }

  handleAcceptTrade() {
    console.log("active: ", this.active);
    if (this.hasSufficientResources) {
      this.api.acceptTradeRequest(this.id);
    }
  }

  handleTradeReject() {
    this.api.rejectTradeRequest(this.id);
  }

  handleTradeCancel() {
    this.api.cancelTradeRequest(this.id);
  }

  // border on the player portrait background
  borderStyle(role: Role) {
    return { border: `0.2rem solid var(--color-${role})` };
  }

  // frame of the player portrait background
  frameStyle(role: Role) {
    return { backgroundColor: `var(--color-${role})` };
  }
}
</script>
