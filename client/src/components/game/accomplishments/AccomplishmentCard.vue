<template>
  <div
    :class="[cardTypeStyling, isModal ? 'modal-view' : '']"
    class="w-100 p-0 mb-3 flex-shrink-0 overflow-hidden"
    v-show="cardIsActive"
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
          <p :style="fontColor" class="w-100">{{ accomplishment.label }}</p>
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
          :class="shouldResourceBeGrayedOut(investment) ? 'unattainable-resource' : ''"
          :key="investment + Math.random()"
          class="cost justify-content-center align-items-center"
          v-for="investment in accomplishmentCost"
        >
          <img
            :src="
              require(`@port-of-mars/client/assets/icons/${investment}.svg`)
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
      <button :disabled="!canPurchase || playerReady" @click="handlePurchase()">
        Purchase Accomplishment
      </button>

    </div>

    <!-- in discard phase, allow discard -->
    <div
      class="w-100 m-0 p-3 wrapper text-center discard"
      v-else-if="type === cardType.discard && showCard"
    >
      <button :disabled="playerReady" @click="handleDiscard()">
        Discard Accomplishment
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
import {AccomplishmentData, Investment, INVESTMENTS, Resource,} from '@port-of-mars/shared/types';

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
      upkeep: undefined,
      victoryPoints: undefined,
      effect: undefined,
    }),
  })
  private accomplishment!: AccomplishmentData;

  @Prop({default: AccomplishmentCardType.default})
  private type!: AccomplishmentCardType;

  @Prop({default: true})
  private showDescription!: boolean;

  /* this is for handling whether or not the card has been
    purchased or discarded
  */
  @Prop({default: true})
  private showCard!: boolean;

  private cardIsActive: boolean = true;

  //we want a different view for the modals.
  @Prop({default: false})
  private isModal!: boolean;

  // NOTE :: All / Default Type

  get playerReady() {
    return this.$tstore.getters.player.ready;
  }

  get cardType() {
    return AccomplishmentCardType;
  }

  /**
   * Determine card styling based on card type (purchase, discard, or default)
   * and showCard to evaluate if card should be hidden based on purchase or
   * discard status.
   *
   */
  get cardTypeStyling() {
    switch (this.type) {
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

  get accomplishmentCost() {
    return INVESTMENTS.filter(
      (investment) => this.accomplishment[investment] !== 0
    ).flatMap((investment) =>
      _.fill(Array(Math.abs(this.accomplishment[investment])), investment)
    );
  }

  get fontColor() {
    if (!this.showCard) {
      return {color: 'white'};
    }

    return {color: 'black'};
  }

  get canPurchase() {
    return canPurchaseAccomplishment(this.accomplishment, this.playerInventory);
  }

  get playerInventory() {
    let pendingInventory = _.clone(
      this.$tstore.getters.player.pendingInvestments
    );
    let inventory = _.clone(this.$tstore.getters.player.inventory);

    Object.keys(inventory).forEach((resource) => {
      inventory[resource as Resource] += pendingInventory[resource as Resource];
    });

    return inventory;
  }

  // NOTE :: Purchase Type

  @Watch('showCard', {immediate: true})
  shouldShowCard(showCard: boolean) {
    if (!showCard) {
      // if Accomplishment status changes, remove card
      setTimeout(() => (this.cardIsActive = false), 5000);
    }
  }

  // expand card into modal that displays accomplishment info
  private showInfo() {
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

  private handlePurchase() {
    if (this.canPurchase) {
      this.api.purchaseAccomplishment(this.accomplishment);
    }
  }

  private shouldResourceBeGrayedOut(investment: Investment) {
    if (investment === 'upkeep') {
      return false;
    }

    if (this.playerInventory[investment] > 0) {
      this.playerInventory[investment]--;
      return false;
    }
    return true;
  }

  // NOTE :: Discard Type

  private handleDiscard() {
    this.api.discardAccomplishment(this.accomplishment.id as number);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/accomplishments/AccomplishmentCard.scss';
</style>
