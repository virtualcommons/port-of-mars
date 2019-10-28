<template>
    <div class="login-button-container">
      <router-link to="/game">
        <BButton @click="setLayout('default-layout')">Go to dashboard</BButton>
      </router-link>
      <router-link to="/game">
        <BButton @click="setLayout('tutorial-layout')">Go to Tutorial</BButton>
      </router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BButton } from 'bootstrap-vue';

  @Component({
    components: {
      BButton,
    },
  })

export default class LoginButton extends Vue {
  /**
   * setLayout() method
   * @param layout : The name of the layout.
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

</style>
