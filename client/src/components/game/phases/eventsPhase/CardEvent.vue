<template>
  <div  @click="handleClick" class="card-event-component"
    v-bind="{style: visible || active ? 'height:14.5rem' : 'height:4rem'}"
  >
    <div class="name">
      <p>{{ event.name }}</p>
      <font-awesome-icon v-show="visible"
          :icon="['fa', 'check']"
          size="lg"
          class="close-icon"
        />

        <font-awesome-icon v-show="active"
          :icon="['fa', 'caret-right']"
          size="lg"
          class="close-icon"
        />
    </div>
    <div class="effect"
      v-bind="{style: visible || active ? 'padding:0.5rem' : 'padding:0'}"
    >
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCheck);
library.add(faCaretRight);

Vue.component('font-awesome-icon', FontAwesomeIcon);

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

  @Prop({default: false})
  active!: boolean;

  private handleClick(): void {
    this.$root.$emit('openModalCard', {
      card: 'event',
      payload: this.event
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/eventsPhase/CardEvent.scss';
</style>
