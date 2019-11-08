<template>
  <div class="card-event" @click="handleClick">
    <div>
      <p class="card-title"><b>{{event.name}}</b></p>
      <p class="card-info">{{event.info}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})

export default class CardEvent extends Vue {
  // Note: need to pass in actual data
  @Prop({ default: () => ({ name: 'pregame status', info: '' }) }) event;

  handleClick() {
    this.$root.$emit('openCard', {
      card: 'event',
      payload: {
        title: this.event.name,
        info: this.event.flavorText,
        effects: 'no effects',
      },
    });
  }
}
</script>

<style scoped>
.card-event {
  height: 7rem;
  width: 9.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.125rem solid #F5F5F5;
  border-radius: 1rem;
  cursor: pointer;
  color:white;
  font-size: 0.9rem;
  text-align: center;
}

.card-title{
  color:#c67b5c;
  font-style: italic;
  font-size:1rem;
}
</style>
