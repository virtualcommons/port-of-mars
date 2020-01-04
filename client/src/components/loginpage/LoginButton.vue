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

<style lang="scss" scoped>
@import '@/stylesheets/loginpage/LoginButton.scss';
</style>
