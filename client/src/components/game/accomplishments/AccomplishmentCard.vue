<template>
  <div
    :class="[cardTypeStyling(type), isModal ? 'modal-view' : '']"
    class="w-100 p-0 mb-3 flex-shrink-0 overflow-hidden"
    v-show="isActive"
  >
    <!-- title -->
    <div class="w-100 m-0">
      <b-row align-v="center" class="w-100 justify-content-center">
        <b-col class="px-4 mr-auto" cols="auto" v-if="!isModal">
          <b-icon-exclamation-circle-fill
            @click="showInfo"
            circle
            variant="dark"
          />
        </b-col>
        <b-col class="mt-2 text-center">
          <p :style="fontColor()" class="w-100">{{ accomplishment.label }}</p>
        </b-col>

      </b-row>
    </div>


    <!-- information: points, description -->
    <div class="w-100 m-0 p-2 wrapper">
      <b-row
        :class="isModal ? 'p-4 p-lg-4' : ''"
        align-v="center"
      >
        <!-- points -->
        <b-col
          :class="showDescription ? 'mt-3 col-3' : 'col-12'"
          class="points"
        >
          <p>Points</p>
          <p>{{ accomplishment.victoryPoints }}</p>
        </b-col>

        <!-- description -->
        <b-col
          :class="showDescription ? 'mt-3' : ''"
          class="flavortext col-9"
          v-if="showDescription"
        >
          <p>{{ accomplishment.flavorText }}</p>
        </b-col>
      </b-row>
    </div>


    <!-- cost -->
    <div class="w-100 m-0 pt-1 wrapper">
      <b-row class="flex-wrap justify-content-center px-4 py-2">
        <div
          :class="investment.available ? '' : 'unattainable-resource'"
          class="cost justify-content-center align-items-center"
          v-for="investment in accomplishmentCost"
        >
          <img
            :src="
              require(`@port-of-mars/client/assets/icons/${investment.influence}.svg`)
            "
            alt="Investment"
          />
        </div>
      </b-row>
    </div>

    <!-- in purchase phase, allow purchase if sufficient resources -->
    <div
      class="w-100 m-0 p-3 wrapper text-center purchase"
      v-if="type === cardType.purchase && showCard"
    >
      <button :disabled="!canPurchase || playerReady" @click="purchase()">
        Purchase Accomplishment
      </button>

    </div>

    <!-- in discard phase, allow discard -->
    <div
      class="w-100 m-0 p-3 wrapper text-center discard"
      v-else-if="type === cardType.discard && showCard"
    >
      <button v-if="!isEffortsWasted" :disabled="playerReady" @click="discard()">
        Discard Accomplishment
      </button>

      <button v-else :disabled="playerReady" @click="discardPurchasedAccomplishment()">
        Discard Purchased Accomplishment
      </button>
    </div>

    <!-- display status of card after it has been purchased or discarded -->
    <div
      class="w-100 m-0 p-3 status-text"
      v-else
    >
      <div class="text" v-if="type === cardType.discard">
        <p>Accomplishment Discarded</p>
      </div>
      <div class="text" v-else-if="type === cardType.purchase">
        <p>Accomplishment Purchased</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Prop, Vue, Watch,} from 'vue-property-decorator';
import {AccomplishmentCardType} from '@port-of-mars/client/types/cards.ts';
import {
  AccomplishmentData,
  Investment,
  InvestmentData,
  INVESTMENTS,
  Resource,
  ResourceAmountData,
} from '@port-of-mars/shared/types';

import {library} from '@fortawesome/fontawesome-svg-core';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

import {GameRequestAPI} from '@port-of-mars/client/api/game/request';
import {canPurchaseAccomplishment} from '@port-of-mars/shared/validation';

import * as _ from 'lodash';

library.add(faInfoCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class AccomplishmentCard extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  @Prop({
    default: () => ({
      id: undefined,
      role: undefined,
      label: undefined,
      flavorText: undefined,
      science: undefined,
      government: undefined,
      legacy: undefined,
      finance: undefined,
      culture: undefined,
      systemHealth: undefined,
      victoryPoints: undefined,
      effect: undefined,
    }),
  })
  accomplishment!: AccomplishmentData;

  // accomplishment type: default, discard, purchase
  @Prop({default: AccomplishmentCardType.default})
  type!: AccomplishmentCardType;

  // show accomplishment description
  @Prop({default: true})
  showDescription!: boolean;

  // if card has been discarded, showCard = false
  // else showCard = true
  @Prop({default: true})
  showCard!: boolean;

  // accomplishment modal view
  @Prop({default: false})
  isModal!: boolean;

  // set when showCard changes
  isActive: boolean = true;

  // local player's readiness
  get playerReady() {
    return this.$tstore.getters.ready;
  }

  get isEffortsWasted() {
    return this.$tstore.getters.isEffortsWasted;
  }

  // local player's pending investments
  get pendingInvestments(): InvestmentData {
    return this.$tstore.getters.player.pendingInvestments;
  }

  // local player's inventory
  get inventory(): ResourceAmountData {
    return this.$tstore.getters.player.inventory;
  }

  // accomplishment type: default, discard, purchase
  get cardType() {
    return AccomplishmentCardType;
  }

  /**
   * Map cost of accomplishments to available influences in local player's inventory.
   * */
  get accomplishmentCost() {
    // local player's inventory - defines inventory numerically
    // e.g. { culture: 3, science: 0, finance: 0, legacy: 0, govt: 0 }
    const inventory = this.playerInventory;

    // accomplishment cost as an array (e.g. [culture, culture, culture]
    const costs = INVESTMENTS.filter(
      // this.accomplishment generates cost of accomplishment
      // e.g. cost = { ..., culture: 3, science: 0, finance: 0, legacy: 0, govt: 0 }
      (influence) => this.accomplishment[influence] != 0
    ).flatMap((influence) =>

      // accomplishment cost formatted as : [ culture, culture, culture]
      _.fill(Array(Math.abs(this.accomplishment[influence])), influence)
    );

    // create data structure to map accomplishment cost to local player's available influences
    // in their inventory
    const costMap = [];
    for (const influence of costs) {
      costMap.push({
        influence,
        available: this.isInfluenceAvailable(influence, inventory),
      })
    }

    // return cost map
    return costMap;

  }

  // local player's inventory
  get playerInventory() {
    const pendingInventory = _.cloneDeep(this.pendingInvestments);
    const inventory = _.cloneDeep(this.inventory);

    Object.keys(inventory).forEach((resource) => {
      inventory[resource as Resource] += pendingInventory[resource as Resource];
    });

    return inventory;
  }

  // determine if local player can purchase accomplishment by comparing
  // accomplishment cost to inventory
  get canPurchase(): boolean {
    const inventory = this.playerInventory;
    const accomplishment = this.accomplishment;
    return canPurchaseAccomplishment(accomplishment, inventory);
  }

  // hide card if showCard value changes upon discard
  @Watch('showCard', {immediate: true})
  shouldShowCard(showCard: boolean) {
    if (!showCard) {
      // if Accomplishment status changes, remove card
      setTimeout(() => (this.isActive = false), 5000);
    }
  }

  /**
   * Determine card styling based on card type (purchase, discard, or default)
   * and showCard to evaluate if card should be hidden based on purchase or
   * discard status.
   *
   */
  cardTypeStyling(type: AccomplishmentCardType) {
    switch (type) {
      case AccomplishmentCardType.purchase:
        if (this.showCard) {
          return this.canPurchase ? 'purchasable' : 'unpurchasable';
        } else {
          return 'purchased hide-card';
        }
      case AccomplishmentCardType.discard:
        if (this.showCard) {
          return this.canPurchase ? 'purchasable' : 'default';
        } else {
          return 'discarded hide-card';
        }
      case AccomplishmentCardType.default:
        return this.canPurchase ? 'purchasable' : 'unpurchasable';
      default:
        return 'default';
    }
  }

  // font color for accomplishment title
  fontColor() {
    if (!this.showCard) return {color: 'white'};
    return {color: 'black'};
  }

  // expand card into modal that displays accomplishment info
  showInfo() {
    let data = {
      type: 'CardModal',
      data: {
        activator: 'User',
        title: 'Accomplishment Card',
        content: 'This is an accomplishment.',
        cardType: 'AccomplishmentCard',
        cardData: this.accomplishment,
        confirmation: false,
      },
    };

    this.api.setModalVisible(data);
  }

  /**
   * Determine if influence is available in local player's inventory
   * @param influence
   * @param inventory
   */
  isInfluenceAvailable(influence: Investment, inventory: ResourceAmountData) {
    if (influence === 'systemHealth') {
      return true;
    }

    // check science, govt, finance, legacy, culture
    if (inventory[influence] > 0) {
      inventory[influence]--;
      return true;
    }

    return false;
  }

  // purchase accomplishment
  purchase() {
    if (this.canPurchase) this.$emit('purchased', this.accomplishment);
  }

  // discard accomplishment
  discard() {
    this.$emit('discarded', this.accomplishment.id);
  }

  discardPurchasedAccomplishment() {
    this.$emit('discardPurchased', this.accomplishment.id)
  }

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/accomplishments/AccomplishmentCard.scss';
</style>
