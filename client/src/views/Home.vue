<template>
  <div class="home">
    <div class="wrapper">
      <h1>Port of Mars</h1>
      <div class="buttons">
        <!-- TODO: ADD BUTTON ONCE USER IS LOGGED IN -->
        <router-link :to="'lobby'">
          <button>Lobby</button>
        </router-link>
        <router-link :to="'tutorial'">
          <button>Go to Tutorial</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/views/Home.scss';
</style>
