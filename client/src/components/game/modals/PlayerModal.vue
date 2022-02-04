<template>
  <b-container fluid class="h-100">
    <!-- player stats row -->
    <b-row class="w-100">
      <!-- player image -->
      <b-col cols="2">
        <div class="indicator" :style="indicatorStyle">
          <div class="frame" :style="frameColor">
            <img :src="roleImage" :alt="`${role}`" />
          </div>
        </div>
      </b-col>
      <!-- information -->
      <b-col cols="6" align-self="center">
        <h3 class="role">
          {{ roleData.isSelf ? `${role} (Your Role)` : role }}
        </h3>
        <b-button
          squared
          variant="outline-secondary"
          size="lg"
          v-if="!roleData.isSelf && gamePhase === phase.trade"
          @click="handleRequestTrade"
        >
          Request Trade
        </b-button>
      </b-col>

      <div class="w-100 my-3"></div>

      <!-- col: player inventory -->
      <b-col cols="6">
        <h2 class="text-center p-2" style="background-color: var(--primary)">Inventory</h2>
        <div>
          <div v-if="!roleData.isSelf && !isUnderAudit">
            <p class="my-4 text-center">
              This information cannot be viewed at this time. Check back later...
            </p>
          </div>
          <div v-else-if="roleData.isSelf || isUnderAudit">
            <Inventory :isSelf="false" :role="role"></Inventory>
          </div>
        </div>
      </b-col>
      <b-col cols="6">
        <h2 class="text-center p-2" style="background-color: var(--primary)">
          Accomplishments
        </h2>
        <b-button-group class="w-100 my-3">
          <b-button
            squared
            @click="switchAccomplishmentType('purchasable')"
            :variant="accomplishmentType === 'purchasable' ? 'secondary' : 'outline-secondary'"
          >
            Available
          </b-button>
          <b-button
            squared
            @click="switchAccomplishmentType('purchased')"
            :variant="accomplishmentType === 'purchased' ? 'secondary' : 'outline-secondary'"
          >
            Purchased
          </b-button>
        </b-button-group>
        <div class="outer-wrapper backdrop">
          <div class="p-3" v-if="!roleData.isSelf && !isUnderAudit">
            <p class="my-4" v-if="accomplishmentType === 'purchasable'">
              This information is currently private and cannot be viewed at this time.
            </p>
            <p v-if="accomplishmentType === 'purchased'" class="my-auto text-center">No purchased accomplishments</p>
          </div>
          <!-- col: accomplishments -->
          <div class="scroll p-3" v-else-if="roleData.isSelf || isUnderAudit">
            <AccomplishmentCard
              v-for="accomplishment in accomplishmentCards"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showDescription="false"
            ></AccomplishmentCard>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from "vue-property-decorator";
import { Role, Phase } from "@port-of-mars/shared/types";
import Inventory from "@port-of-mars/client/components/game/Inventory.vue";
import AccomplishmentCard from "@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

library.add(faTimes);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {
    Inventory,
    AccomplishmentCard
  }
})
export default class PlayerModal extends Vue {
  @Inject() readonly api!: GameRequestAPI;
  @Prop() role!: Role;
  accomplishmentType: string = "purchasable";

  get roleData() {
    return {
      info: this.$tstore.state.players[this.role],
      isSelf: this.role === this.$tstore.getters.player.role
    };
  }

  get gamePhase() {
    return this.$tstore.state.phase;
  }

  get phase() {
    return Phase;
  }

  get ranking() {
    return (
      Object.keys(this.$tstore.state.players)
        .sort((a, b) => {
          return (
            this.$tstore.state.players[b as Role].victoryPoints -
            this.$tstore.state.players[a as Role].victoryPoints
          );
        })
        .indexOf(this.role) + 1
    );
  }

  get isUnderAudit() {
    return this.$tstore.getters.isUnderAudit;
  }

  get roleImage(): any {
    return this.role
      ? require(`@port-of-mars/client/assets/characters/${this.role}.png`)
      : require(`@port-of-mars/client/assets/characters/Researcher.png`);
  }

  get frameColor(): object {
    return this.role
      ? { backgroundColor: `var(--color-${this.role})` }
      : { backgroundColor: `var(--color-Researcher)` };
  }

  get indicatorStyle() {
    return !this.roleData.info.ready
      ? { border: `0.2rem solid var(--color-${this.role})` }
      : { border: `0.2rem solid var(--green)` };
  }

  get accomplishmentCards(): any {
    switch (this.accomplishmentType) {
      case "purchasable":
        return this.roleData.info.accomplishments.purchasable;
      case "purchased":
        return this.roleData.info.accomplishments.purchased;
      default:
        return this.roleData.info.accomplishments.purchasable;
    }
  }

  switchAccomplishmentType(type: string): void {
    this.accomplishmentType = type;
  }
}
</script>

<style lang="scss" scoped>
.scroll {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 20rem;
}

.outer-wrapper {
  height: 20rem;
}

.picture,
.information,
.trade {
  height: 100%;
  padding: 0;
}

.picture {
  overflow: hidden;
  @include make-column-and-center;
}

.indicator {
  height: 8rem;
  width: 8rem;
  padding: 0.25rem;
  border-radius: 50%;
}

.frame {
  @include expand;
  border-radius: 50%;
  @include make-center;
}

img {
  object-fit: cover;
  height: 60%;
}

.information {
  @include make-column-and-center;
  align-items: flex-start;

  .role {
    margin-bottom: 0.25rem;
    color: $light-shade;
    font-size: $font-large;
    font-weight: $bold;
  }

  .score {
    margin-bottom: 0.25rem;
    color: $light-shade;
    font-size: $font-med;
    font-weight: $medium;
  }

  .ranking {
    margin-bottom: 0;
    color: $light-shade;
    font-size: $font-med;
    font-weight: $medium;
  }
}
</style>
