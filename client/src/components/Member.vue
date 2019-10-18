<template>
  <div class="member">

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class Member extends Vue {}
</script>

<style scoped>
.member {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 4.5rem;
  color: #F5F5F5;
  background-color: rgba(245, 245, 245, 0.2);
  border: 0.125rem solid #F5F5F5;
  border-radius: 1rem;
}
</style>
