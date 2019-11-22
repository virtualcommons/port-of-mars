<template>
  <div class="card-event" @click="handleClick">
    <div class="card-name">
      <p>{{ event.name }}</p>
    </div>
    <div class="card-effect">
      <p>{{ event.effect }}</p>
    </div>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  /* border: 0.125rem solid var(--space-white-opaque-2); */
}

.card-event:hover {
  transform: scale(1.1);
}

.card-name {
  width: 100%;
  margin-bottom: 0.5rem;
  border-radius: 1rem 1rem 0 0;
  color: var(--space-gray);
  background-color: var(--space-orange);
}

.card-name p {
  width: 100%;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0;
  text-align: center;
  text-transform: capitalize;
}

.card-effect {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0 0 1rem 1rem;
  flex-grow: 1;
  background-color: var(--space-white-opaque-1);
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.card-effect::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.card-effect p {
  width: 100%;
  margin-bottom: 0;
  text-align: center;
  font-size: var(--font-small);
  color: var(--space-white);
}
</style>
