<template>
  <div class="d-flex flex-column backdrop p-2 h-100 overflow-hidden">
    <div class="d-flex flex-shrink-1 m-2 mt-3">system health bar</div>
    <div class="d-flex flex-row flex-grow-1 overflow-hidden">
      <div class="d-flex flex-column flex-grow-1 overflow-hidden">
        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden">
          <div class="cell-grow">thresholds</div>
          <div class="d-flex flex-md-column flex-row flex-grow-1 overflow-hidden">
            <div class="cell-grow">round number</div>
            <div class="cell-grow">timer</div>
          </div>
          <div class="cell-grow">round events</div>
        </div>
        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden">
          <div class="cell-grow">player points and resources</div>
          <div class="cell-grow">investment input</div>
        </div>
      </div>
      <div class="cell-shrink mw-25">event deck</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Solayout extends Vue {}
</script>

<style lang="scss">
.cell {
  background-color: $dark-shade-75;
  border: 0.2rem solid $light-shade-25;
  overflow: scroll;
  margin: 0.5rem;
  padding: 0.5rem;
}

.cell-grow {
  @extend .cell;
  flex-grow: 1;
  flex-shrink: 1;
}

.cell-shrink {
  @extend .cell;
  flex-grow: 0;
  flex-shrink: 1;
}

.mw-25 {
  max-width: 25%;
}
</style>
