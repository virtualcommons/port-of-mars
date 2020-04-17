<template>
  <div class="c-player-modal container tour-player-info-modal">
    <div class="top-wrapper row tour-player-info-modal-stats">
      <div class="top container">
        <div class="wrapper row">
          <div class="picture col-2">
            <div class="indicator" :style="indicatorStyle">
              <div class="frame" :style="frameColor">
                <img :src="playerRoleImage" alt="Player Image" />
              </div>
            </div>
          </div>
          <div class="information col-6 ">
            <p class="role">
              {{
                playerData.isSelf ? `You (${modalData.role})` : modalData.role
              }}
            </p>
            <p class="score">Score: {{ playerData.info.victoryPoints }}</p>
            <p class="ranking">Ranking: {{ ranking }} / 5</p>
          </div>
          <div class="trade col-4">
            <button
              v-if="!playerData.isSelf && gamePhase === phase.trade"
              @click="handleRequestTrade"
            >
              Request Trade
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-wrapper row">
      <div class="bottom container">
        <div class="wrapper row">
          <div class="inventory col-4 tour-player-info-modal-inventory">
            <div class="topbar">
              <p class="title">Inventory</p>
            </div>
            <div class="outer-wrapper">
              <div
                class="unavailable"
                v-if="!playerData.isSelf && !isUnderAudit"
              >
                <p>Unavailable</p>
              </div>
              <div
                class="wrapper"
                v-else-if="playerData.isSelf || isUnderAudit"
              >
                <Inventory
                  :isSelf="false"
                  :role="modalData.role"
                  :displaySystemHealth="false"
                />
              </div>
            </div>
          </div>
          <div class="purchasable-accomplishments col-8 tour-player-info-modal-accomplishments">
            <div class="topbar">
              <p class="title">Accomplishments</p>
            </div>
            <div class="buttons">
              <button
                @click="switchAccomplishmentType('active')"
                :class="accomplishmentType === 'active' ? 'selected' : ''"
              >
                Active
              </button>
              <button
                @click="switchAccomplishmentType('purchased')"
                :class="accomplishmentType === 'purchased' ? 'selected' : ''"
              >
                Purchased
              </button>
            </div>
            <div class="outer-wrapper">
              <div
                class="unavailable"
                v-if="!playerData.isSelf && !isUnderAudit"
              >
                <p>Unavailable</p>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayerInfoModalData } from '@port-of-mars/client/types/modals';
import { Role, Phase } from '@port-of-mars/shared/types';
import Inventory from '@port-of-mars/client/components/game/Inventory.vue';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
// import ContainerAccomplishmentsGeneral from '@port-of-mars/client/components/game/accomplishments/ContainerAccomplishmentsGeneral.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    Inventory,
    AccomplishmentCard,
    // ContainerAccomplishmentsGeneral,
  },
})
export default class PlayerModal extends Vue {
  @Prop({}) private modalData!: PlayerInfoModalData;
  // private errorMessageActive: boolean = false;
  private accomplishmentType: string = 'active';

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
      ? { backgroundColor: `var(--color-${this.modalData.role})` }
      : { backgroundColor: `var(--color-Researcher)` };
  }

  get indicatorStyle() {
    return !this.playerData.info.ready
      ? { border: `0.2rem solid var(--color-${this.modalData.role})` }
      : { border: `0.2rem solid var(--status-green)` };
  }

  private switchAccomplishmentType(type: string): void {
    this.accomplishmentType = type;
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

  private handleRequestTrade() {
    if (!this.playerData.isSelf && this.gamePhase === this.phase.trade) {
      // this.$tstore.commit('OPEN_TRADE_MODAL_WARM', {
      //   role: this.modalData.role,
      // });
      this.$tstore.commit('SET_MODAL_VISIBLE', {
        type: 'TradeRequestModal',
        data: {},
      });
    } else {
      // this.errorMessageActive = true;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/PlayerModal.scss';
</style>
