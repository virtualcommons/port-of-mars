<template>
  <div class="container-accomplishments">
    <div class="topbar">
      <p class="title">Your Accomplishments</p>
      <div class="buttons">
        <button
          @click="handleClick('available')"
          :style="handleStyle('available')"
          class="available"
          type="button"
          name="Available Button Option"
        >
          Available
        </button>
        <button
          @click="handleClick('purchased')"
          :style="handleStyle('purchased')"
          class="purchased"
          type="button"
          name="Purchased Button Option"
        >
          Purchased
        </button>
      </div>
    </div>
    <div class="accomplishment-cards">
      <div class="available" v-if="activeView == 'available'">
        <p v-if="purchasableAccomplishments.length === 0" class="available-empty">
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
      </div>

      <div class="purchased" v-if="activeView == 'purchased'">
        <p v-if="boughtAccomplishments.length === 0" class="purchased-empty">
          No Purchased Accomplishments
        </p>
        <CardAccomplishment
          v-for="accomplishment in boughtAccomplishments"
          :key="accomplishment.id"
          :accomplishment="accomplishment"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CardAccomplishment from '@/components/gamedashboard/global/cards/CardAccomplishment.vue';
import { Phase } from 'shared/types';

@Component({
  components: {
    CardAccomplishment
  }
})
export default class ContainerAccomplishments extends Vue {
  private activeView: string = 'available';
  private isActive: boolean = true;
  private setWidth: string = '100%';

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

  handleStyle(view: string) {
    return this.activeView == view ? { color: 'var(--space-orange)' } : '';
  }

  handleDiscardAccomplishment(a: any) {
    this.$root.$emit('openConfirmation', {
      text: `Select 'Yes' if you want to draw another card.`,
      type: 'discardAccomplishment',
      actionData: a.id
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/left/containers/ContainerAccomplishments.scss';
</style>
