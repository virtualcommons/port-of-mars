<template>
  <component :is="eventAccomplishmentsView"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import AccomplishmentsSelectPurchased from '@/components/gamedashboard/bottom/events/views/AccomplishmentsSelectPurchased.vue';

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
@import '@/stylesheets/gamedashboard/bottom/events/EventAccomplishments.scss';
</style>
