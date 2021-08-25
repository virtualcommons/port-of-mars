<template>
  <b-container fluid class="h-100">
    <!-- player stats row -->
    <b-row class="w-100">
      <!-- player picture -->
      <b-col cols="2">
        <div class="indicator" :style="indicatorStyle">
          <div class="frame" :style="frameColor">
            <img :src="playerRoleImage" alt="Player Image"/>
          </div>
        </div>
      </b-col>
      <!-- information -->
      <b-col cols="6" align-self="center">
        <h3 class="role">
          {{
            playerData.isSelf ? `You (${modalData.role})` : modalData.role
          }}
        </h3>
      </b-col>
      <!-- trade -->
      <b-col cols="4">
        <b-button
          v-if="!playerData.isSelf && gamePhase === phase.trade"
          @click="handleRequestTrade">
          Request Trade
        </b-button>
      </b-col>
    </b-row>
    <b-row class="w-100 my-5" align="center">
      <!-- col: player inventory -->
      <b-col cols="4">
          <h2 class="text-center">Inventory</h2>
        <div class="outer-wrapper">
          <div
            class="unavailable"
            v-if="!playerData.isSelf && !isUnderAudit"
          >
            <p>This information cannot be viewed at this time. Check back later...</p>
          </div>
          <div
            class="wrapper"
            v-else-if="playerData.isSelf || isUnderAudit"
          >
            <Inventory :isSelf="false" :role="modalData.role"/>
          </div>
        </div>
      </b-col>
      <b-col cols="8">
          <h2 class="text-center">Accomplishments</h2>
        <b-button-group class="w-100">
          <b-button
            squared
            @click="switchAccomplishmentType('available')"
            :pressed="accomplishmentType === 'available'"
          >
            Available
          </b-button>
          <b-button
            squared
            @click="switchAccomplishmentType('purchased')"
            :pressed="accomplishmentType === 'purchased'"
          >
            Purchased
          </b-button>
        </b-button-group>
        <div class="outer-wrapper">
          <div
            class="unavailable"
            v-if="!playerData.isSelf && !isUnderAudit"
          >
            <p v-if="accomplishmentType==='available'">This information is currently private and cannot
              be viewed at this time.</p>
            <p v-if="accomplishmentType==='purchased'">None</p>
          </div>
          <!-- col: accomplishments -->
          <div
            class="wrapper"
            v-else-if="playerData.isSelf || isUnderAudit"
          >
            <AccomplishmentCard
              v-for="accomplishment in accomplishmentCards"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showDescription="false"
            />
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Vue, Prop, Inject} from 'vue-property-decorator';
import {PlayerInfoModalData} from '@port-of-mars/shared/game/client/modals';
import {Role, Phase} from '@port-of-mars/shared/types';
import Inventory from '@port-of-mars/client/components/game/Inventory.vue';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {GameRequestAPI} from '@port-of-mars/client/api/game/request';

library.add(faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    Inventory,
    AccomplishmentCard,
  },
})
export default class PlayerModal extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  @Prop({}) modalData!: PlayerInfoModalData;
  accomplishmentType: string = 'available';

  get playerData() {
    return {
      info: this.$tstore.state.players[this.modalData.role],
      isSelf: this.modalData.role === this.$tstore.getters.player.role,
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
        .indexOf(this.modalData.role) + 1
    );
  }

  get isUnderAudit() {
    return this.$tstore.getters.isUnderAudit;
  }

  get playerRoleImage(): any {
    return this.modalData.role
      ? require(`@port-of-mars/client/assets/characters/${this.modalData.role}.png`)
      : require(`@port-of-mars/client/assets/characters/Researcher.png`);
  }

  get frameColor(): object {
    return this.modalData.role
      ? {backgroundColor: `var(--color-${this.modalData.role})`}
      : {backgroundColor: `var(--color-Researcher)`};
  }

  get indicatorStyle() {
    return !this.playerData.info.ready
      ? {border: `0.2rem solid var(--color-${this.modalData.role})`}
      : {border: `0.2rem solid var(--green)`};
  }

  get accomplishmentCards(): any {
    switch (this.accomplishmentType) {
      case 'active':
        return this.playerData.info.accomplishments.purchasable;
      case 'purchased':
        return this.playerData.info.accomplishments.purchased;
      default:
        return this.playerData.info.accomplishments.purchasable;
    }
  }

  switchAccomplishmentType(type: string): void {
    this.accomplishmentType = type;
  }

  handleRequestTrade() {
    if (!this.playerData.isSelf && this.gamePhase === this.phase.trade) {
      this.api.setModalVisible({
        type: 'TradeRequestModal',
        data: {},
      });
    }
  }

  /**
   * Get card type: default (0), purchase (1), discard (2)
   */
  get cardType(): AccomplishmentCardType {
    return AccomplishmentCardType.purchase;
  }
}
</script>

<style lang="scss" scoped>
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
