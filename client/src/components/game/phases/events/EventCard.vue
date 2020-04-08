<template>
  <div v-if="visible" class="c-eventcard container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <p>{{ event.name }}</p>
        <font-awesome-icon
          :icon="['fas', 'info-circle']"
          size="lg"
          @click="handleClick"
          class="icon"
        />
      </div>
    </div>

    <div class="flavortext-wrapper row">
      <div class="flavortext col-12">
        <p>{{ event.effect !== '' ? event.effect : 'No special effect' }}</p>
      </div>
    </div>

    <div class="duration-wrapper row">
      <div class="duration col-12">
        <p>
          Duration:<span> {{ event.elapsed }} </span>of<span>
            {{ event.duration }} </span
          >Rounds
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AccomplishmentData } from '@port-of-mars/shared/types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faInfoCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class EventCard extends Vue {
  @Prop({
    default: () => ({
      id: undefined,
      duration: undefined,
      elapsed: undefined,
      name: undefined,
      flavorText: undefined,
      effect: undefined,
    }),
  })
  private event!: AccomplishmentData;

  @Prop({ default: false }) private visible!: boolean;
  @Prop({ default: false }) private active!: boolean;

  private handleClick(): void {
    this.$root.$emit('openModalCard', {
      card: 'event',
      payload: this.event,
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/events/EventCard.scss';
</style>
