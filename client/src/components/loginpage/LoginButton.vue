<template>
  <div class="login-button-container">
    <router-link to="/lobby">
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
.login-button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-button-container button {
  height: 3.5rem;
  width: 18rem;
  margin: 0.5rem;
  border-radius: 0.75rem;
  border: 0.125rem solid var(--space-white-opaque-2);
  outline: none !important;
  color: var(--space-white);
  background-color: rgba(245, 245, 245, 0.2);
}
</style>
