<template>
  <div class="card-event-test" @click="handleClick">
    <div class="card-name">
      <p>{{ event.name }}</p>
    </div>
    <div class="card-effect">
      <p>{{ event.effect }}</p>
      <!-- <p>{{ event.effectText }}</p> -->
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
        effects: this.event.effect
      }
    });
  }
}
</script>

<style scoped>
.card-event-test {
  height: 12rem;
  width: 14.5rem !important;
  margin: 0 0.25rem;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.card-event-test:first-child {
  margin-left: 0;
}

.card-event-test:last-child {
  margin-right: 0;
}

.card-event:hover {
  transform: scale(1.1);
}

.card-name {
  width: 100%;
  margin-bottom: 0.5rem;
  /* border-radius: 1rem 1rem 0 0; */
  color: var(--space-gray);
  background-color: var(--space-white);
}

.card-name p {
  width: 100%;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0;
  text-align: center;
  text-transform: capitalize;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.card-effect {
  width: 100%;
  padding: 0.5rem;
  /* border-radius: 0 0 1rem 1rem; */
  flex-grow: 1;
  /* background-color: var(--space-white-opaque-1); */
  background-color: var(--space-gray);
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
