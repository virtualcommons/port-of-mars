<template>
  <div :style="statusColor('borderColor')" class="c-trade container"
       v-bind:class="{'hide-trade': !active}"
       v-show="show">
    <div :style="statusColor('backgroundColor')" class="title-wrapper">
      <p :style="textColor" class="title">New Trade Request</p>
    </div>
    <div class="trade-wrapper row">
      <div class="to-container col">
        <div class="inner-wrapper row">
          <div class="player col-4">
            <div :style="borderStyle(recipient.role)" class="outer-frame">
              <div :style="frameStyle(recipient.role)" class="inner-frame">
                <img
                  :src="
                    require(`@port-of-mars/client/assets/characters/${recipient.role}.png`)
                  "
                  alt="Player To"
                />
              </div>
            </div>
            <div class="text">
              <p class="title">Request</p>
              <p class="player-text">{{ recipient.role }}</p>
            </div>
          </div>
          <div class="investments col-8">
            <div
              :key="name"
              class="wrapper"
              v-for="(value, name) in recipient.resourceAmount"
            >
              <img
                :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
                alt="Investment"
              />
              <p v-if="value !== 0">{{ value }}</p>
              <p v-if="value === 0">-</p>
            </div>
          </div>
        </div>
      </div>
      <div class="icon-container col-1">
        <font-awesome-icon
          :icon="['fas', 'exchange-alt']"
          class="icon"
          size="lg"
        />
      </div>
      <div class="from-container col">
        <div class="inner-wrapper row">
          <div class="player col-4">
            <div :style="borderStyle(sender.role)" class="outer-frame">
              <div :style="frameStyle(sender.role)" class="inner-frame">
                <img
                  :src="
                    require(`@port-of-mars/client/assets/characters/${sender.role}.png`)
                  "
                  alt="Player To"
                />
              </div>
            </div>
            <div class="text">
              <p class="title">Offer</p>
              <p class="player-text">{{ sender.role }}</p>
            </div>
          </div>
          <div class="investments col-8">
            <div
              :key="name"
              class="wrapper"
              v-for="(value, name) in sender.resourceAmount"
            >
              <img
                :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
                alt="Investment"
              />
              <p v-if="value !== 0">{{ value }}</p>
              <p v-if="value === 0">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-wrapper" v-show="active">
      <!-- REJECT TRADE -->
      <b-button
        :disabled="playerReady"
        @click="handleTradeReject"
        class="decline mr-5"
        title="Reject trade"
        v-b-tooltip.hover.bottom
        pill
        variant="danger"
        v-if="role === recipient.role && role !== sender.role"
      >
        <font-awesome-icon :icon="['fas', 'times']" class="icon" size="sm"/>
      </b-button>

      <!-- ACCEPT TRADE -->
      <b-button
        :disabled="!hasSufficientResources || playerReady"
        @click="handleAcceptTrade"
        class="accept ml-5"
        title="Accept trade"
        v-b-tooltip.hover.bottom
        pill
        variant="success"
        v-if="role === recipient.role && role !== sender.role"
      >
        <font-awesome-icon :icon="['fas', 'check']" class="icon" size="sm"/>
      </b-button>

      <!-- CANCEL TRADE -->
      <b-button
        :disabled="playerReady"
        @click="handleTradeCancel"
        class="cancel"
        title="Cancel trade"
        v-b-tooltip.hover.bottom
        pill
        variant="danger"
        v-if="role === sender.role && role !== recipient.role"
      >
        <font-awesome-icon :icon="['fas', 'times']" class="icon" size="sm"/>
      </b-button>
    </div>
    <div :style="statusColor('color')" class="status-text" v-show="!active">
      <p>Trade Status: {{status}}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Inject, Prop, Vue, Watch} from 'vue-property-decorator';
  import {GameRequestAPI} from '@port-of-mars/client/api/game/request';
  import {RESOURCES, Role, TradeAmountData} from '@port-of-mars/shared/types';
  import {library} from '@fortawesome/fontawesome-svg-core';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons/faExchangeAlt';
  import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
  import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
  import {canPlayerMakeTrade} from "@port-of-mars/shared/validation";

  library.add(faExchangeAlt);
  library.add(faTimes);
  library.add(faCheck);
  Vue.component('font-awesome-icon', FontAwesomeIcon);

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

    get role() {
      return this.$tstore.state.role;
    }

    get playerReady() {
      return this.$tstore.getters.player.ready;
    }

    get hasSufficientResources() {
      // retrieve local player's inventory
      const inventory = this.$tstore.state.players[this.role].inventory;
      let validTrade: boolean = canPlayerMakeTrade(this.recipient.resourceAmount, inventory);

      if (this.role === this.recipient.role) {
        console.log('canPlayerMakeTrade if you are recipient: ', canPlayerMakeTrade(this.recipient.resourceAmount, inventory));
        return validTrade;
      }
    }


    // color code text based on trade status
    get textColor() {
      console.log(this.status);
      if (this.status != 'Active') {
        return {color: `var(--light-accent)`}
      }

      return {color: `var(--dark-shade)`};
    }

    mounted() {
      // on trade mount, hide the trade if it is already inactive
      if (this.status != 'Active') {
        this.active = false;
        this.show = false;
      }
    }

    // watch for trade status changes
    @Watch('status', {immediate: true})
    watchTrade(status: string) {
      console.log({status})
      if (status != 'Active') {
        // start hide animation on the trade
        this.active = false;
        // set the trade to hidden after x milliseconds
        setTimeout(() => this.show = false, 5000);
      }
    }

    // color of the trade header and trade background
    statusColor(type: string) {
      // default color: white
      let color: string = 'var(--light-shade)';

      // if player is involved with the trade, color = orange
      if (this.participant == 1 || this.participant == 0) {
        color = 'var(--light-accent)';
      }

      // alternate statuses supersede involvement
      if (this.status == 'Accepted') {
        color = 'var(--green)';
      } else if (this.status == 'Cancelled' || this.status == 'Rejected') {
        color = 'var(--red)';
      }

      //map to whatever type was passed in
      return {[type]: color};

    }

    handleAcceptTrade() {
      console.log('active: ', this.active);
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
      return {border: `0.2rem solid var(--color-${role})`};
    }

    // frame of the player portrait background
    frameStyle(role: Role) {
      return {backgroundColor: `var(--color-${role})`};
    }
  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/game/phases/trade/ActiveTrade.scss';
</style>
