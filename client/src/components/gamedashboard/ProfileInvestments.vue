<template>
  <div class="profile-investments-container">
    <p class="profile-investments-title">Investments</p>
    <div class="profile-investments">
      <div v-for="investment in investments" class="profile-investment" :key="investment.n">
        <img :src="require(`@/assets/iconsSVG/${investment.n}.svg`)" alt="Investment" />
        <p :style="style(investment)">{{ investment.persistentInventory }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ProfileInvestments extends Vue {
  get investments() {
    return this.$store.state.localInvestments.returnValues;
  }

  style(investment: object): string {
    return investment.persistentInventory <
      investment.persistentInventory + investment.currentInventory
      ? 'color: var(--status-green)'
      : '';
  }
}
</script>

<style scoped>
.profile-investments-container {
  width: 100%;
  padding: 0.5rem;
  border: 0.125rem solid var(--space-white-opaque-2);
}

.profile-investments-title {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: var(--font-med);
  text-align: center;
  /* text-transform: uppercase; */
  color: var(--space-gray);
  background-color: var(--space-orange);
}

.profile-investments {
  display: flex;
  flex-wrap: wrap;
}

.profile-investment {
  width: calc(100% / 3);
  padding: 0.5rem 0.25rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--space-white-opaque-1);
}

.profile-investment img {
  height: 1.5rem;
  width: 1.5rem;
  margin: 0 0.5rem;
}

.profile-investment p {
  margin: 0 0.5rem;
  font-size: var(--font-small);
  color: var(--space-white);
}

@media (max-width: 1366px) {
  .profile-info-player {
    font-size: var(--font-med);
  }
  .profile-frame {
    height: 4rem;
    width: 4rem;
  }
  .profile-investment img {
    height: 1.25rem;
    width: 1.25rem;
  }
}
</style>
