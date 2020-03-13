<template>
  <div v-show="visible" @click="handleClick" class="card-event-component">
    <div class="name">
      <p>{{ event.name }}</p>
    </div>
    <div class="effect">
      <p>{{ event.effect !== '' ? event.effect : 'No special effect' }}</p>
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
import { AccomplishmentData } from '@port-of-mars/shared/types';

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

  @Prop()
  visible!: boolean;

  private handleClick(): void {
    this.$root.$emit('openModalCard', {
      card: 'event',
      payload: this.event
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/cards/CardEvent.scss';
</style>
