<template>
  <div class="home">
    <div class="wrapper">
      <h1>Port of Mars</h1>
      <div class="buttons">
        <!-- TODO: ADD BUTTON ONCE USER IS LOGGED IN -->
        <router-link to="/login">
          <button @click="setLayout('default-layout')">Log In</button>
        </router-link>
        <router-link to="/game">
          <button @click="setLayout('tutorial-layout')">Go to Tutorial</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {
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
@import '@/stylesheets/views/Home.scss';
</style>
