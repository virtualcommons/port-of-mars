<template>
  <div class="card-event" @click="handleClick">

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})

export default class CardEvent extends Vue {
  private cardModalData: object = {
    type: 'event',
    payload: {},
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
  border: 0.125rem solid #F5F5F5;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
