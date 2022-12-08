<template>
  <b-container
    style="height: 10rem; margin: 1rem; background-color: var(--dark-shade); border: 0.2rem solid var(--light-shade-25)"
  >
    <b-row align-h="center" align-v="center" class="h-100">
      <b-col cols="8" class="pl-5">
        <b-row><h2>{{ stat }}</h2></b-row>
        <b-row><h5>{{ title }}</h5></b-row>
      </b-col>
      <b-col cols="4" class="pr-0">
        <b-icon :icon="icon" :variant="variant" font-scale="3"></b-icon>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class AdminStatCard extends Vue {
  @Prop()
  title!: string;

  @Prop()
  stat!: number;

  @Prop()
  icon!: string;

  @Prop()
  variant!: string;
}
</script>

<style scoped lang="scss">
</style>