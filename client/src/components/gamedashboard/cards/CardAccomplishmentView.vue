<template>
  <div class="cm-accomplishment" :style="opacity">
    <div class="cm-accomplishment-title">
      <p>{{ this.cardData.label }}</p>
    </div>
    <div class="cm-accomplishment-info">
      <p>{{ this.cardData.flavorText }}</p>
    </div>
    <div class="cm-accomplishment-investments">
      <p v-for="investment in this.cardData.totalCostArray" :key="investment + Math.random()">
        <!-- Note: will need to edit key implementation -->
        <img :src="require(`@/assets/iconsSVG/${investment}.svg`)" alt="investment" />
      </p>
    </div>
    <p class="cm-accomplishment-investments-title"><span>Cost</span></p>
    <button class="cm-accomplishment-purchase-button" @click="handlePurchase">
      {{ buyButton }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { canPurchaseAccomplishment } from 'shared/validation';
import { AccomplishmentData } from 'shared/types';

@Component({})
export default class CardAccomplishmentView extends Vue {
  @Prop({
    default: () => ({
      label: '---',
      flavorText: '---',
      totalCostArray: []
    })
  })
  private cardData!: AccomplishmentData;

  opacity = '';

  get canBuy() {
    return canPurchaseAccomplishment(this.cardData, this.$tstore.getters.player.inventory);
  }

  get buyButton() {
    this.opacity = 'opacity:100%';
    const b = this.canBuy;
    return b ? 'Purchase accomplishment' : 'You cannot purchase this';
  }

  handlePurchase() {}
}
</script>

<style scoped>
.cm-accomplishment {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cm-accomplishment p {
  margin: 0;
}

.cm-accomplishment-title {
  margin: 0 1rem;
  display: flex;
  flex-wrap: wrap;
}

.cm-accomplishment-title p {
  text-align: center;
  font-size: 2rem;
  text-transform: capitalize;
  color: var(--space-orange);
}

.cm-accomplishment-info {
  margin: 2rem 0;
  text-align: center;
}

.cm-accomplishment-investments-title {
  margin: 1rem 0 0 0 !important;
  font-size: var(--font-small);
}

.cm-accomplishment-investments-title span {
  color: var(--space-orange);
}

.cm-accomplishment-investments {
  margin: 0 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.cm-accomplishment-investments img {
  width: 2.5rem;
  margin: 0 0.25rem;
}

.cm-accomplishment-purchase-button {
  border: none;
  border-bottom: 0.125rem solid var(--space-orange);
  margin-top: 1rem;
  color: var(--space-white);
  background-color: transparent;
}

.cm-accomplishment-purchase-button:focus {
  outline: none;
}
</style>
