<template>
  <div class="statusbar-outer">
    <div class="statusbar-inner">

    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class StatusBar extends Vue {}
</script>

<style lang="css" scoped>
.statusbar-outer {
  display: flex;
  align-items: center;
  height: 1rem;
  flex-grow: 100;
  border: 0.125rem solid #F5F5F5;
  border-radius: 0.50rem;
}

.statusbar-inner {
  height: 0.50rem;
  width: 90%; /* adjust with props */
  margin-left: 0.125rem;
  margin-right: 0.125rem;
  background-color: #F5F5F5; /* adjust with props (?) */
  border-radius: 0.25rem;
}
</style>
