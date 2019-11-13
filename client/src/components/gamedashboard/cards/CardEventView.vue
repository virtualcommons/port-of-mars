<template>
  <div class="cm-event">
    <div class="cm-event-title">
      <p>{{ this.cardData.title }}</p>
    </div>
    <div class="cm-event-info">
      <p>{{ this.cardData.info }}</p>
    </div>
    <div class="cm-event-effects">
      <p>{{ this.cardData.effects }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})

export default class CardEventView extends Vue {
  @Prop({
    default: () => ({
      title: '---',
      info: '---',
      effects: '---',
    }),
  }) private cardData!: object;
}
</script>

<style scoped>
.cm-event {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cm-event p {
  margin: 0;
}

.cm-event-title {
  margin: 0 1rem;
  display: flex;
  flex-wrap: wrap;
}

.cm-event-title p {
  text-align: center;
  font-size: 2rem;
  color: var(--space-orange);
}

.cm-event-info {
  margin: 2rem 0;
  text-align: center;
}

.cm-event-effects {
  text-align: center;
}

.cm-event-effects p {
  margin: 0;
}
</style>
