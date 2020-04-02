<template>
  <component :is="eventAccomplishmentsView"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import AccomplishmentsSelectPurchased from './views/AccomplishmentsSelectPurchased.vue';

@Component({
  components: {
    AccomplishmentsSelectPurchased
  }
})
export default class EventAccomplishments extends Vue {
  @Prop({ default: '' }) private eventView!: string;

  get eventAccomplishmentsView(): string {
    switch (this.eventView) {
      case 'ACCOMPLISHMENT_SELECT_PURCHASED':
        return 'AccomplishmentsSelectPurchased';
      default:
        return '';
    }
    return '';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/eventsPhase/events/EventAccomplishments.scss';
</style>
