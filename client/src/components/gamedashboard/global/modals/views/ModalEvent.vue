<template>
  <div class="cm-event">
    <div class="cm-event-title">
      <p>{{ cardData.name }}</p>
    </div>
    <div class="cm-event-info">
      <p>{{ cardData.flavorText }}</p>
    </div>
    <p class="cm-event-effects-title"><span>Effects</span></p>
    <div class="cm-event-effects">
      <p>{{ cardData.effect }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class ModalEvent extends Vue {
  @Prop({
    default: () => ({
      name: undefined,
      flavorText: undefined,
      effect: undefined
    })
  })
  private cardData!: AccomplishmentData;
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/views/ModalEvent.scss';
</style>
