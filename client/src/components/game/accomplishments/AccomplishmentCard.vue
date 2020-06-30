<template>
  <div
    class="c-accomplishment-card"
    :class="[cardTypeStyling, { 'modal-view': isModal }]"
    v-show="cardIsActive"
  >
    <!-- title -->
    <div class="title-wrapper">
      <div class="d-flex flex-row title col-12">
        <b-icon
          icon="exclamation-circle-fill"
          variant="dark"
          circle
          v-if="!isModal"
          @click="showInfo"
          class="align-self-center"
        />
        <p :style="fontColor">{{ accomplishment.label }}</p>

      </div>
    </div>

    <!-- information: points, description -->
    <div class="info-wrapper row">
      <!-- points -->
      <div
        class="points"
        v-bind="{ class: showDescription ? 'col-3' : 'col-12' }"
      >
        <p>Points</p>
        <p>{{ accomplishment.victoryPoints }}</p>
      </div>

      <!-- description -->
      <div
        class="flavortext col-9"
        v-if="showDescription"
      >
        <p>{{ accomplishment.flavorText }}</p>
      </div>
    </div>

    <!-- cost -->
    <div class="cost-wrapper row">
      <div class="cost col-12">
        <div
          v-for="investment in accomplishmentCost"
          :class="{
            'unattainable-resource': shouldResourceBeGrayedOut(investment),
          }"
          :key="investment + Math.random()"
          class="container"
        >
          <img
            :src="
              require(`@port-of-mars/client/assets/icons/${investment}.svg`)
            "
            alt="Investment"
          />
        </div>
      </div>
    </div>

    <!-- in purchase phase, allow purchase if sufficient resources -->
    <div
      v-if="type === cardType.purchase && showCard"
      class="purchase-wrapper row"
    >
      <div class="purchase col-12">
        <button :disabled="!canPurchase" @click="handlePurchase()">
          Purchase Accomplishment
        </button>
      </div>
    </div>

    <!-- in discard phase, allow discard -->
    <div
      v-if="type === cardType.discard && showCard"
      class="discard-wrapper row"
    >
      <div class="discard col-12">
        <button @click="handleDiscard()">
          Discard Accomplishment
        </button>
      </div>
    </div>

    <!-- display status of card after it has been purchased or discarded -->
    <div
      v-if="
        showCard && (type === cardType.discard || type === cardType.purchase)
      "
      class="status-text row"
    >
      <div v-if="type === cardType.discard" class="text col-12">
        <p>Card Has Been Discarded</p>
      </div>
      <div v-if="type === cardType.purchase" class="text col-12">
        <p>Card Has Been Purchased</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  InjectReactive,
  Inject,
  Watch,
} from 'vue-property-decorator';
import { AccomplishmentCardType } from '@port-of-mars/client/types/cards.ts';
import {
  AccomplishmentData,
  Investment,
  INVESTMENTS,
  Resource,
} from '@port-of-mars/shared/types';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';

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

  @Prop({ default: AccomplishmentCardType.default })
  private type!: AccomplishmentCardType;

  @Prop({ default: true })
  private showDescription!: boolean;

  /* this is for handling whether or not the card has been
    purchased or discarded
  */
  @Prop({default: true})
  private showCard!: boolean;

  @Prop({ default: true })

  private cardIsActive: boolean = true;

  //we want a different view for the modals.
  @Prop({ default: false })
  private isModal!: boolean;

  // NOTE :: All / Default Type

  @Watch('showCard', { immediate: true })
  shouldShowCard(showCard: boolean) {
    if (!showCard) {
      //if the status changes, it's time to start to remove the card
      setTimeout(() => (this.cardIsActive = false), 5000);
    }
  }

  // @Watch('showInfo', {immediate: false})
  // expandCard(showInfo: boolean) {
  //   return showInfo;
  // }

  get cardType() {
    return AccomplishmentCardType;
  }

  //this is the click for the info
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
      return { color: 'white' };
    }

    return { color: 'black' };
  }

  // NOTE :: Purchase Type

  get canPurchase() {
    return canPurchaseAccomplishment(this.accomplishment, this.playerInventory);
  }

  private handlePurchase() {
    if (this.canPurchase) {
      this.api.purchaseAccomplishment(this.accomplishment);
    }
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
    let data = {
      type: 'CardModal',
      data: {
        activator: 'User',
        title: 'Discard Accomplishment Card',
        content:
          "Clicking 'Confirm' will discard this accomplishment. A new accomplishment will replace it next round.",
        cardType: 'AccomplishmentCard',
        cardData: this.accomplishment,
        confirmation: true,
      },
    };
    this.api.discardOption(data);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/accomplishments/AccomplishmentCard.scss';
</style>
