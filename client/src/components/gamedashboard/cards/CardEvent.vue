<template>
  <div class="card-event" @click="handleClick">
    <p class="card-name">{{ event.name }}</p>
    <p class="card-effect">{{ event.effect }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class CardEvent extends Vue {
  // Note: need to pass in actual data
  @Prop({ default: () => ({ name: 'pregame status', flavorText: '-', effect: '-' }) }) event;

  handleClick() {
    this.$root.$emit('openCard', {
      card: 'event',
      payload: {
        title: this.event.name,
        info: this.event.flavorText,
        effects: this.event.effect,
      },
    });
  }
}
</script>

<style scoped>
.card-event {
  height: 12rem;
  width: 30%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0.125rem solid var(--space-white);
  border-radius: 1rem;
  cursor: pointer;
  text-align: center;
}

.card-name {
  color: var(--space-orange);
  text-transform: capitalize;
  text-align: center;
  margin: 0 1rem;
}

.card-effect {
  /* background-color: orange; */
  font-size: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
  color: var(--space-white);
}
</style>
