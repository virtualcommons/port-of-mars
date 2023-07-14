<template>
  <div>
    <h4> {{ deck }} </h4>
  </div>
</template>
  
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { EventCardData } from "@port-of-mars/shared/sologame";
  
@Component({})
export default class Deck extends Vue {
  @Prop() deck!: EventCardData;
}
</script>
  
<style lang="scss"></style>