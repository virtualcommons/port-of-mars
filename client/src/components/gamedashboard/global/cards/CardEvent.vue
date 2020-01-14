<template>
  <div @click="handleClick" class="card-event-component">
    <div class="name">
      <p>{{ event.name }}</p>
    </div>
    <div class="effect">
      <p>{{ event.effect }}</p>
    </div>
    <div class="length">
      <p>
        Duration:<span> {{ event.elapsed }} </span>of<span>
          {{ event.duration }} </span
        >Rounds
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {AccomplishmentData} from "shared/types";

@Component({})
export default class CardEvent extends Vue {
  @Prop({
    default: () => ({
      id: undefined,
      duration: undefined,
      elapsed: undefined,
      name: undefined,
      flavorText: undefined,
      effect: undefined
    })
  })
  private event!: AccomplishmentData;

  mounted() {
    console.log('MOUNTED: ', this.event);
    // console.log('ID: ', this.event.id);
    // console.log('NAME: ', this.event.name);
  }

  updated() {
    console.log('UPDATED: ', this.event);
  }

  handleClick() {
    this.$root.$emit('openModalCard', {
      card: 'event',
      payload: this.event
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/cards/CardEvent.scss';
</style>
