<template>
  <div class="card-event" @click="handleClick">
    <div>
      <p class="card-title"><b>{{event.name}}</b></p>
      <p class="card-info">Event Effects</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})

export default class CardEvent extends Vue {
  // Note: need to pass in actual data
  @Prop() event;

  private relevantCardData = {
    title: this.event.name,
    info: this.event.flavorText,
    effects: 'Event Effects',
  }

  private cardModalData: object = {
    card: 'event',
    payload: this.relevantCardData,
  }

  handleClick() {
    this.$root.$emit('openCard', this.cardModalData);
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
