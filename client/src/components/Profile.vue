<template>
  <div class="profile">
    <div class="profile-frame">
      <p>img</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class Profile extends Vue {}
</script>

<style scoped>
.profile {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: pink; */
}

.profile p {
  margin: 0;
}

.profile-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12rem;
  width: 12rem;
  margin: 1rem 0;
  background-color: rgba(245, 245, 245, 0.2);
  border: 0.125rem solid #C67B5C;
  border-radius: 50%;
}
</style>
