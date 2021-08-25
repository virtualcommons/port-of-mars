<template>
  <div
    :class=" isModal ? 'modal-view' : 'mb-3'"
    class="w-100 p-0 mx-0 overflow-hidden"
    v-if="visible"
    style="border: .125rem solid var(--light-shade)"
  >
    <b-row class="w-100 justify-content-center mx-auto p-3"
           style="cursor: pointer; background-color: var(--light-shade)"
           @click="showInfo"
           v-b-modal="'gameModal'"
    >
      <b-col>
      </b-col>
      <b-col cols="6" class="title">
        <p>{{ event.name }}</p>
      </b-col>
      <b-col>
        <font-awesome-icon
          :icon="['far', 'dot-circle']"
          class="icontwo animated pulse infinite"
          size="lg"
          v-if="showActiveIndicator"
        />
      </b-col>
    </b-row>

    <b-row class="w-100 justify-content-center mx-auto flex-grow-1"
           :class="isModal ? 'pt-4 px-3' : 'p-3'"
           style="background-color: var(--dark-shade)"
    >
      <b-col class="w-100 p-0 m-0 text-center">
        <p>{{ event.effect !== '' ? event.effect : 'No special effect' }}</p>
      </b-col>
    </b-row>

    <b-row class="w-100 justify-content-center mx-auto"
           :class="isModal ? 'pt-1' : 'pb-3'"
           :style="'background-color: #221A1B'"
    >
      <b-col class="w-100 p-0 m-0 text-center">
        <p>
          Duration:
          <template v-if="event.duration > 1">
            <b>{{ event.elapsed }}</b> of
          </template>
          <b>{{ event.duration }}</b> Round(s)
        </p>
      </b-col>
    </b-row>

    <b-row class="w-100 py-4 justify-content-center text-center" v-if="wasSpawnedByServer">
      <b-col class="interact" v-if="requiresInteraction">
        <button @click="closeModal" class="button">Interact</button>
      </b-col>
      <b-col class="interact" v-else>
        <button @click="readyUp" class="button">Continue</button>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import {Component, Inject, Prop, Vue} from 'vue-property-decorator';
  import {EventClientView, MarsEventData, Phase} from '@port-of-mars/shared/types';
  import {library} from '@fortawesome/fontawesome-svg-core';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
  import {faDotCircle} from '@fortawesome/free-regular-svg-icons/faDotCircle';
  import {GameRequestAPI} from '@port-of-mars/client/api/game/request';

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
    private event!: MarsEventData;

    @Prop({default: false}) private visible!: boolean;
    @Prop({default: false}) private active!: boolean;

    //if you're in a modal, show the modal view
    @Prop({default: false}) private isModal!: boolean;

    //if the modal was spawned by the server, show the option buttons
    @Prop({default: false}) private wasSpawnedByServer!: boolean;
    //determining which type of events require which interactions
    private eventNoChangeViews: Array<EventClientView> = [
      'NO_CHANGE',
      'AUDIT',
      'DISABLE_CHAT'
    ];

    get phase() {
      return Phase;
    }

    get gamePhase() {
      return this.$store.state.phase;
    }

    get showActiveIndicator() {
      return this.active && this.gamePhase === this.phase.events;
    }

    get requiresInteraction() {
      return !this.eventNoChangeViews.includes(this.event.clientViewHandler);
    }

    closeModal() {
      this.api.setModalHidden();
    }

    readyUp() {
      this.api.setPlayerReadiness(true);
      this.api.setModalHidden();
    }

    private showInfo(): void {
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
