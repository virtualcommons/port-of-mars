<template>
  <BContainer class="container-accomplishments">
    <div class="topbar-container">
      <p class="accomplishments-topbar-title">Your Accomplishments</p>
      <div class="topbar-container-buttons">
        <button
          @click="handleClick('available')"
          :style="activeView == 'available' ? { color: 'var(--space-orange)' } : ''"
          class="available-btn"
          type="button"
          name="button"
        >
          Available
        </button>
        <button
          @click="handleClick('purchased')"
          :style="activeView == 'purchased' ? { color: 'var(--space-orange)' } : ''"
          class="purchased-btn"
          type="button"
          name="button"
        >
          Purchased
        </button>
      </div>
    </div>
    <BRow class="accomplishment-cards">
      <BRow class="accomplishments-cards-available" v-if="activeView == 'available'">
        <p
          v-if="purchasableAccomplishments.length === 0"
          class="accomplishments-cards-available-empty"
        >
          No Available Accomplishments
        </p>
        <CardAccomplishment
          v-for="accomplishment in purchasableAccomplishments"
          :key="accomplishment.id"
          :accomplishment="accomplishment"
        />
        <!-- NEED TO FIX DISCARD PHASE ABILITY -->
        <!-- <button
          class="discard-button"
          :style="{ display: canDiscard }"
          @click="handleDiscardAccomplishment(accomplishment)"
        >
          <img :src="require(`@/assets/trashIcon.svg`)" />
        </button> -->
      </BRow>

      <BRow class="accomplishments-cards-inventory" v-if="activeView == 'purchased'">
        <p v-if="boughtAccomplishments.length === 0" class="accomplishments-cards-inventory-empty">
          No Purchased Accomplishments
        </p>
        <CardAccomplishment
          v-for="accomplishment in boughtAccomplishments"
          :key="accomplishment.id"
          :accomplishment="accomplishment"
        />
      </BRow>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import CardAccomplishment from '@/components/gamedashboard/cards/CardAccomplishment.vue';
import { Phase } from 'shared/types';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    CardAccomplishment
  }
})
export default class ContainerAccomplishments extends Vue {
  private activeView: string = 'available';
  private isActive = true;
  private setWidth = '100%';

  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishment.purchasable;
  }

  get boughtAccomplishments() {
    return this.$store.getters.player.accomplishment.bought;
  }

  get canDiscard() {
    let phase = this.$tstore.state.phase;
    if (phase === Phase.discard) {
      this.setWidth = '95%';
      return '';
    } else {
      this.setWidth = '100%';
      return 'none';
    }
  }

  handleClick(view: string) {
    this.activeView = view;
  }

  handleDiscardAccomplishment(a) {
    this.$root.$emit('openConfirmation', {
      text: `Select 'Yes' if you want to draw another card.`,
      type: 'discardAccomplishment',
      actionData: a.id
    });
  }
}
</script>

<style scoped>
.container-accomplishments {
  height: 60%;
  width: 100%;
  max-width: none;
  padding: 0.5rem;
  /* border: 0.125rem solid var(--space-white-opaque-2); */
  margin: 0.5rem 0 0 0;
  display: flex;
  flex-flow: column;
}

.topbar-container {
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-bottom: 0.5rem;
}

.topbar-container-buttons {
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
}

.topbar-container-buttons button {
  width: 50%;
  border: none;
  font-size: var(--font-small);
  color: var(--space-white-opaque-2);
  background: transparent;
}

.topbar-container-buttons button:focus,
.topbar-container-buttons button:active {
  outline: none;
}

.available-btn {
  margin-right: 0.25rem;
}

.purchased-btn {
  margin-left: 0.25rem;
}

.accomplishments-topbar-title {
  width: 100%;
  padding: 0.5rem;
  border-bottom: 0.125rem solid var(--space-white-opaque-2);
  margin-bottom: 0;
  font-size: var(--font-med);
  text-align: left;
  /* color: var(--space-orange); */
  color: var(--space-white-opaque-2);
  /* background-color: var(--space-orange); */
  background-color: transparent;
}

.btn-active {
  color: var(--space-white) !important;
  background-color: var(--space-gray) !important;
}

.accomplishment-cards {
  flex-grow: 1;
  width: 100%;
  padding: 0.5rem;
  margin: 0;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  background-color: var(--space-white-opaque-1);
}

.accomplishment-cards::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.accomplishments-cards-available,
.accomplishments-cards-inventory {
  min-height: 100%;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.accomplishments-cards-available-empty,
.accomplishments-cards-inventory-empty {
  margin-bottom: 0;
  font-size: var(--font-small);
  text-align: center;
  color: var(--space-white-opaque-2);
}

.discard-button {
  height: 2.5rem;
  width: 2.5rem;
  border: none;
  border-radius: 50%;
  text-align: center;
  background-color: white;
}
</style>
