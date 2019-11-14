<template>
  <div class="cm-accomplishment">
    <div class="cm-accomplishment-title">
      <p>{{ this.cardData.title }}</p>
    </div>
    <div class="cm-accomplishment-info">
      <p>{{ this.cardData.info }}</p>
    </div>
    <div class="cm-accomplishment-investments">
      <p v-for="investment in this.cardData.total" :key="investment + Math.random()">
        <!-- Note: will need to edit key implementation -->
        <img
          :src="require(`@/assets/investmentsIcons/${investment}.png`)"
          alt='investment'
        />
      </p>
    </div>
    <p class="cm-accomplishment-investments-title">( <span>Cost</span> )</p>
    <p>You {{ canBuy }} have enough influences to buy this card</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})

export default class CardAccomplishmentView extends Vue {
  @Prop({
    default: () => ({
      title: '---',
      info: '---',
      total: [],
    }),
  }) private cardData;

  get canBuy() {
    const investments = this.$store.state.localInvestments.returnSafeValues;

    let canBuy = true;
    this.cardData.total.forEach((investment) => {
      console.log(investment, investments[investment].persistentInventory);
      investments[investment].persistentInventory -= 1;

      if (investments[investment].persistentInventory <= -1) {
        canBuy = false;
      }
    });

    console.log(canBuy);
    return canBuy ? '' : 'do not';
  }
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

.cm-accomplishment-cost-title {
  margin: 1rem 0 0 0 !important;
  font-size: var(--font-small);
}

.cm-accomplishment-cost-title span {
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
  width:2.5rem;
  margin: 0 0.25rem;
}
</style>
