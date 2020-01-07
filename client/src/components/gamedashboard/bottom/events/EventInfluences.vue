<template>
  <component :is="eventInvestmentsView"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import InfluencesSelect from '@/components/gamedashboard/bottom/events/views/InfluencesSelect.vue';
import InfluencesDraw from '@/components/gamedashboard/bottom/events/views/InfluencesDraw.vue';

@Component({
  components: {
    InfluencesSelect,
    InfluencesDraw
  }
})
export default class EventInfluences extends Vue {
  @Prop({ default: '' }) private eventView!: string;

  get eventInvestmentsView(): string {
    switch (this.eventView) {
      case 'INFLUENCES_SELECT':
        return 'InfluencesSelect';
      case 'INFLUENCES_DRAW':
        return 'InfluencesDraw';
      default:
        return '';
    }
    return '';
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/EventInfluences.scss';
</style>
