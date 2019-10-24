<template>
  <div :style="style()" @click="handleClick" class="member">
    <div class="member-notif">
      <p class="member-notif-num">0</p>
    </div>
    <p class="member-score">0</p>
    <img :src="require(`@/assets/characters/${setImg()}.png`)" alt="Player" class="member-img" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
// import Curator from '@/assets/characters-svg/Curator.svg';

@Component
export default class Member extends Vue {
  @Prop({ default: "Curator" }) private player!: string;
  @Prop({ default: 90 }) private setWidth!: number;

  setImg(): string {
    return this.player;
  }

  style(): object {
    return { width: `${this.setWidth}%` };
  }

  handleClick() {
    this.$root.$emit("openTrading", "open");
  }
}
</script>

<style scoped>
.member {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  height: 4.5rem;
  background-color: rgba(245, 245, 245, 0.2);
  border: 0.125rem solid #f5f5f5;
  border-radius: 1rem;
}

.member-notif {
  position: absolute;
  left: -0.75rem;
  top: -0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #c67b5c;
  border-radius: 50%;
}

.member-notif-num {
  text-align: center;
  font-size: 0.75rem !important;
  color: #1e2223 !important;
  margin: 0;
}

.member-score {
  color: #f5f5f5;
  font-size: 1.5rem;
  margin: 0;
}

.member-img {
  fill: #f5f5f5;
  height: 100%;
  font-size: 1.5rem;
  margin: 0;
}
</style>
