<template>
  <div
    class="c-accomplishmentcard"
    :class="[cardTypeStyling, { 'modal-view': isModal }]"
    v-show="cardIsActive"
  >
    <div class="title-wrapper row">
      <div class="title col-12">
        <p :style="fontColor">{{ accomplishment.label }}</p>
        <font-awesome-icon
          v-if="!isModal"
          :icon="['fas', 'info-circle']"
          size="lg"
          @click="handleClick"
          class="icon"
        />
      </div>
    </div>

    <div class="info-wrapper row">
      <div
        class="points"
        v-bind="{ class: showDescription ? 'col-3' : 'col-12' }"
      >
        <p>Points</p>
        <p>{{ accomplishment.victoryPoints }}</p>
      </div>
      <div class="flavortext col-9" v-if="showDescription">
        <p>{{ accomplishment.flavorText }}</p>
      </div>
    </div>

    <div v-if="showCost" class="cost-wrapper row">
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

    <div
      v-if="
        showCard && (type === cardType.discard || type === cardType.purchase)
      "
      class="status-text row"
    >
      <div v-if="type == cardType.discard" class="text col-12">
        <p>Card Has Been Discarded</p>
      </div>
      <div v-if="type == cardType.purchase" class="text col-12">
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

  @Prop({ default: true })
  private showCost!: boolean;

  @Prop({ default: true })
  private showCard!: boolean;

  private cardIsActive: boolean = true;

  @Prop({ default: false })
  private isModal!: boolean;

  // NOTE :: All / Default Type

  @Watch('showCard', { immediate: true })
  shouldShowCard(showCard: boolean) {
    if (!showCard) {
      setTimeout(() => (this.cardIsActive = false), 1900);
    }
  }

  get cardType() {
    return AccomplishmentCardType;
  }

  private handleClick() {
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
        //return 'default';
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
