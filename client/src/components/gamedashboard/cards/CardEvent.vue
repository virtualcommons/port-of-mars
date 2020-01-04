<template>
  <div @click="handleClick" class="card-event-component">
    <div class="name">
      <p>{{ event.name }}</p>
    </div>
    <div class="effect">
      <p>{{ event.effect }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class CardEvent extends Vue {
  @Prop({
    default: () => ({
      id: undefined,
      name: undefined,
      flavorText: undefined,
      effect: undefined
    })
  })
  private event!: AccomplishmentData;

  handleClick() {
    this.$root.$emit('openCard', {
      card: 'event',
      payload: this.event
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/cards/CardEvent.scss';
</style>
