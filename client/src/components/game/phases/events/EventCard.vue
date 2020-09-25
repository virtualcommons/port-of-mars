<template>
  <div
    :class="{'modal-view': isModal}"
    class="c-eventcard d-flex flex-column justify-content-between justify-content-center"
    v-if="visible"
  >
    <div class="title-wrapper">
      <div class="d-flex flex-row title">
        <b-icon
          @click="showInfo"
          circle
          class="align-self-center"
          icon="exclamation-circle-fill"
          v-if="!isModal"
          variant="dark"
        />
        <p>{{ event.name }}</p>
        <font-awesome-icon
          :icon="['far', 'dot-circle']"
          class="icontwo animated pulse infinite"
          size="lg"
          v-if="showActiveIndicator"
        />
      </div>
    </div>

    <div class="flavortext-wrapper w-100 h-100" v-bind="{ class: isModal ? 'pt-4 px-3' : '' }">
      <div class="flavortext">
        <p>{{ event.effect !== '' ? event.effect : 'No special effect' }}</p>
      </div>
    </div>

    <div class="duration-wrapper w-100 h-100" v-bind="{ class: isModal ? 'pt-1' : '' }">
      <div class="duration">
        <p>
          Duration: 
          <template v-if="event.duration > 1">
            <em>{{ event.elapsed }}</em> of 
          </template>
          <b>{{ event.duration }}</b> Round(s)
        </p>
      </div>
    </div>

    <div class="w-100 h-100 pt-2" v-if="wasSpawnedByServer">
      <div class="interact" v-if="requiresInteraction">
        <button @click="closeModal" class="button">Interact</button>
      </div>
      <div class="interact" v-else>
        <button @click="readyUp" class="button">Continue</button>
      </div>
    </div>


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
      if (!this.eventNoChangeViews.includes(this.event.clientViewHandler)) {
        return true;
      }
      return false;
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
