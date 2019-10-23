<template>
  <div class="member">
    <div class="member-notif">
      <p class="member-notif-num">0</p>
      <!-- will need to change on props -->
    </div>
    <p class="member-score">0</p>
    <!-- will need to change on props -->
    <p class="member-img"></p>
    <!-- will need to change on props -->
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
  justify-content: space-around;
  align-items: center;
  position: relative;
  width: 100%;
  height: 4.5rem;
  background-color: rgba(245, 245, 245, 0.2);
  border: 0.125rem solid #F5F5F5;
  border-radius: 1rem;
}

.member-notif {
  position: absolute;
  left: -0.75rem;
  top: -0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #C67B5C;
  border-radius: 50%;
}

.member-notif-num {
  text-align: center;
  font-size: 0.75rem !important;
  color: #1E2223 !important;
  margin: 0;
}

.member-score {
  color: #F5F5F5;
  font-size: 1.5rem;
  margin: 0;
}

.member-img {
  color: #F5F5F5;
  font-size: 1.5rem;
  margin: 0;
}
</style>
