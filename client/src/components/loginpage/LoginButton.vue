<template>
  <div class="login-button-container">
    <router-link to="/game">
      <button @click="setLayout('default-layout')">Let's Go!</button>
    </router-link>
    <router-link to="/game">
      <button @click="setLayout('tutorial-layout')">Go to Tutorial</button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class LoginButton extends Vue {
  /**
   * setLayout() method
   * @param layout The string value of the layout.
   * Commits to the store by changing the layout
   * string value on the store.
   *
   */
  setLayout(layout: string) {
    this.$store.commit('SET_LAYOUT', layout);
  }
}
</script>

<style scoped>
.login-button-container button {
  height: 3.5rem;
  width: 18rem;
  margin: 0 1rem;
  border-radius: 0.75rem;
  border: 0.125rem solid #f5f5f5;
  outline: none !important;
  color: #f5f5f5;
  background-color: rgba(245, 245, 245, 0.2);
}
</style>
