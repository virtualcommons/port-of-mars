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
  @Prop({ default: () => ({ name: '---', flavorText: '---', effect: '---' }) }) event;

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
  border: var(--border-white);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all .2s ease-in-out;
}

.card-event:hover {
  transform: scale(1.1);
}

.card-name {
  margin: 0 1rem;
  text-align: center;
  text-transform: capitalize;
  color: var(--space-orange);
}

.card-effect {
  margin-top: 0.5rem;
  margin-bottom: 0;
  font-size: var(--font-small);
  color: var(--space-white);
}
</style>
