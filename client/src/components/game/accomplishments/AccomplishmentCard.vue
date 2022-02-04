<template>
  <b-container
    fluid
    :style="
      canPurchase
        ? 'border: 0.125rem solid var(--light-accent)'
        : 'border: 0.125rem solid var(--light-shade)'
    "
    style="background-color: var(--dark-shade)"
    class="p-0 mx-0 mb-2"
    v-show="isActive"
  >
    <!-- title -->
    <b-row align-v="center" class="w-100 mx-0 mt-2 p-0 text-center">
      <b-col
        v-b-modal="accomplishmentModalId"
        :style="showCard ? 'color: black' : 'color: white'"
        style="cursor: pointer"
      >
        <h5
          :style="
            canPurchase
              ? 'backgroundColor: var(--light-accent)'
              : 'backgroundColor: var(--light-shade)'
          "
          class="p-2 text-center"
        >
          {{ accomplishment.label }}
        </h5>
      </b-col>

      <!-- Equal-width columns that span multiple lines: https://bootstrap-vue.org/docs/components/layout#comp-ref-b-col -->
      <div class="w-100"></div>

      <!-- accomplishment list item information: only display points -->
      <b-col class="d-flex flex-column justify-content-center align-items-center col-12 m-0 p-2">
        <p>{{ accomplishment.victoryPoints }} Points</p>
      </b-col>
      <div class="w-100"></div>
      <!-- cost -->
      <b-col
        class="d-flex flex-wrap w-100 m-0 pt-1 justify-content-center px-4 py-2"
        style="transition: all 0.15s ease-in-out;"
      >
        <div
          :class="investment.available ? '' : 'unattainable-resource'"
          class="cost justify-content-center align-items-center"
          v-for="investment in costToPurchase"
          :key="investment.name"
        >
          <img
            :src="require(`@port-of-mars/client/assets/icons/${investment.influence}.svg`)"
            alt="Investment"
          />
        </div>
      </b-col>

      <div class="w-100"></div>

      <!-- in purchase phase, allow purchase if sufficient resources -->
      <b-col
        class="w-100 m-0 p-3 justify-content-center"
        v-if="type === isPurchaseType && showCard"
        style="transition: all 0.15s ease-in-out"
      >
        <b-button
          variant="outline-success"
          squared
          size="lg"
          :disabled="!canPurchase || playerReady"
          @click="purchase"
        >
          Purchase Accomplishment
        </b-button>
      </b-col>

      <!-- in discard phase, allow discard -->
      <b-col
        class="w-100 m-0 p-3 justify-content-center"
        style="transition: all 0.15s ease-in-out;"
        v-else-if="type === isDiscardType && showCard"
      >
        <b-button
          variant="outline-danger"
          squared
          size="lg"
          v-if="isEffortsWasted"
          :disabled="playerReady"
          @click="discardPurchasedAccomplishment"
        >
          Discard Purchased Accomplishment
        </b-button>

        <b-button
          variant="outline-danger"
          squared
          size="lg"
          v-else
          :disabled="playerReady"
          @click="discard"
        >
          Discard Accomplishment
        </b-button>
      </b-col>

      <!-- display status of card after it has been purchased or discarded -->
      <b-col class="w-100 m-0 p-3 text-center" style="transition: all 0.15s ease-in-out" v-else>
        <p v-if="type === isDiscardType">Accomplishment Discarded</p>
        <p v-else-if="type === isPurchaseType">Accomplishment Purchased</p>
      </b-col>
    </b-row>
    <b-modal
      :id="accomplishmentModalId"
      centered
      no-stacking
      hide-header
      hide-footer
      body-bg-variant="dark"
      size="lg"
    >
      <AccomplishmentModal
        :modalData="accomplishment"
        :costToPurchase="costToPurchase"
        :canPurchase="canPurchase"
      ></AccomplishmentModal>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";
import { AccomplishmentCardType } from "@port-of-mars/client/types/cards";
import {
  AccomplishmentData,
  Investment,
  InvestmentData,
  INVESTMENTS,
  Resource,
  ResourceAmountData
} from "@port-of-mars/shared/types";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { canPurchaseAccomplishment } from "@port-of-mars/shared/validation";
import AccomplishmentModal from "@port-of-mars/client/components/game/modals/AccomplishmentModal.vue";
import * as _ from "lodash";

library.add(faInfoCircle);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {
    AccomplishmentModal
  }
})
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
      effect: undefined
    })
  })
  accomplishment!: AccomplishmentData;

  // accomplishment type: default, discard, purchase
  @Prop({ default: AccomplishmentCardType.default })
  type!: AccomplishmentCardType;

  // if card has been discarded, showCard = false
  // else showCard = true
  @Prop({ default: true })
  showCard!: boolean;

  // since Accomplishment cards are generated in more than one place (HUD Left and PhaseSwitcher)
  // when a user clicked on it to show the modal, the modal opens 2x because the Accomplishment card
  // was referenced 2x by the v-b-modal directive. To solve this problem, a locationId prop is created
  // to pass in a string to append to the modal ID to prevent the modal from showing 2x and
  // to disambiguate the source of the click.
  @Prop({ default: "", required: false })
  locationId!: string;

  // set when showCard changes
  isActive: boolean = true;

  // hide card if showCard value changes upon purchase or discard
  @Watch("showCard", { immediate: true })
  shouldShowCard(showCard: boolean): void {
    if (!showCard) {
      // if Accomplishment status changes, remove card
      setTimeout(() => (this.isActive = false), 5000);
    }
  }

  get accomplishmentModalId() {
    if (this.locationId === "") {
      return `accomplishment-modal-${this.accomplishment.id}`;
    } else {
      return `accomplishment-modal-${this.accomplishment.id}-${this.locationId}`;
    }
  }

  get isPurchaseType(): AccomplishmentCardType {
    return AccomplishmentCardType.purchase;
  }

  get isDiscardType(): AccomplishmentCardType {
    return AccomplishmentCardType.discard;
  }

  // local player's readiness
  get playerReady() {
    return this.$tstore.getters.ready;
  }

  get isEffortsWasted() {
    return this.$tstore.getters.isEffortsWastedActive;
  }

  // local player's pending investments
  get pendingInvestments(): InvestmentData {
    return this.$tstore.getters.player.pendingInvestments;
  }

  // local player's inventory
  get inventory(): ResourceAmountData {
    return this.$tstore.getters.player.inventory;
  }

  /**
   * Map cost of accomplishments to available influences in local player's inventory.
   * */
  get costToPurchase(): { influence: Investment; available: boolean }[] {
    // local player's inventory - defines inventory numerically
    // e.g. { culture: 3, science: 0, finance: 0, legacy: 0, govt: 0 }
    const inventory = this.playerInventory;

    // accomplishment cost as an array (e.g. [culture, culture, culture]
    const costs = INVESTMENTS.filter(
      // this.accomplishment generates cost of accomplishment
      // e.g. cost = { ..., culture: 3, science: 0, finance: 0, legacy: 0, govt: 0 }
      influence => this.accomplishment[influence] != 0
    ).flatMap(influence =>
      // accomplishment cost formatted as : [ culture, culture, culture]
      _.fill(Array(Math.abs(this.accomplishment[influence])), influence)
    );

    // console.log("costs: ", costs);
    // console.log("accomplishment: ", this.accomplishment);

    // create data structure to map accomplishment cost to local player's available influences in their inventory
    const costMap: { influence: Investment; available: boolean }[] = [];
    for (const influence of costs) {
      costMap.push({
        influence,
        available: this.isInfluenceAvailable(influence, inventory)
      });
    }

    // return cost map
    return costMap;
  }

  // local player's inventory
  get playerInventory() {
    const pendingInventory = _.cloneDeep(this.pendingInvestments);
    const inventory = _.cloneDeep(this.inventory);

    Object.keys(inventory).forEach(resource => {
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

  /**
   * Determine if influence is available in local player's inventory
   *
   * FIXME: this should not mutate inventory
   * @param influence
   * @param inventory
   */
  isInfluenceAvailable(influence: Investment, inventory: ResourceAmountData): boolean {
    if (influence === "systemHealth") {
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
    if (this.canPurchase) this.$emit("purchased", this.accomplishment);
  }

  // discard accomplishment
  discard(): void {
    this.$emit("discarded", this.accomplishment.id);
  }

  discardPurchasedAccomplishment(): void {
    this.$emit("discardPurchased", this.accomplishment.id);
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/accomplishments/AccomplishmentCard.scss";
p {
  font-size: var(--font-med);
}

// .purchasable {
//   background-color: $light-accent;
// }

// .unpurchasable {
//   background-color: $light-shade;
// }

// .purchased {
//   color: var(--status-green);
// }

// .discarded {
//   color: var(--status-red);
// }
</style>
