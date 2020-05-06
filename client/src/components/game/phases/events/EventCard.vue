<template>
  <div v-if="visible" class="c-eventcard container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <p>{{ event.name }}</p>
        <font-awesome-icon
          v-if="showActiveIndicator"
          :icon="['far', 'dot-circle']"
          size="lg"
          class="icontwo animated pulse infinite"
        />
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
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import { AccomplishmentData, Phase } from '@port-of-mars/shared/types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons/faDotCircle';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';

library.add(faInfoCircle);
library.add(faDotCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class EventCard extends Vue {
  @Inject() readonly api!: GameRequestAPI;

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

  get phase() {
    return Phase;
  }

  get gamePhase() {
    return this.$store.state.phase;
  }

  get showActiveIndicator() {
    return this.active && this.gamePhase === this.phase.events;
  }

  private handleClick(): void {
    this.api.setModalVisible({
      type: 'CardModal',
      data: {
        activator: 'User',
        title: 'Event',
        content: 'This is a description of the Event.',
        cardType: 'EventCard',
        cardData: this.event,
        confirmation: false,
      },
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/events/EventCard.scss';
@import '~animate.css/source/attention_seekers/pulse.css';
</style>
