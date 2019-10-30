<template>
  <div class="trading-member">
    <div class="trading-member-img">
      <img
      :src="require(`@/assets/characters/${setImg()}.png`)"
      alt="Player">
    </div>
    <div class="trading-member-status">
      <p>{{ notificationCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})

export default class TradingModal extends Vue {
  @Prop({ default: 'Curator' }) private playerRole!: string;

  @Prop({ default: -1 }) private notificationCount!: number;

  setImg(): string {
    return this.playerRole;
  }
}
</script>

<style scoped>
.trading-member {
  height: 25%;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #F5F5F5;
  /* background-color: blue; */
}

.trading-member-img {
  height: 100%;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* background-color: purple; */
}

.trading-member-img img {
  height: 100%;
}

.trading-member-status {
  height: 100%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: orange; */
}

.trading-member-status p {
  margin: 0;
}
</style>
