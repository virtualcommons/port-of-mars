<template>
  <div class="default-layout">
    <!-- <div class="stars" v-if="$route.path !== '/game' && $route.path !== '/lobby'"></div>
    <div class="twinkling" v-if="$route.path !== '/game' && $route.path !== '/lobby'"></div>
    <div class="clouds" v-if="$route.path !== '/game' && $route.path !== '/lobby'"></div> -->
    <router-view />
    {{ routerInfo }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { WaitingRequestAPI } from '../api/waitingLobby/request';

@Component({
  name: 'default-layout'
})
export default class DefaultLayout extends Vue {
  @Inject() readonly $api!: WaitingRequestAPI;

  get routerInfo() {
    if (this.$api.joinRoom !== undefined) {
      if (this.$route.path == '/game') {
        this.$api.joinRoom('game');
      }

      if (this.$route.path == '/quiz') {
        this.$api.joinRoom('quiz');
      }
    }

    return this.$route.path;
  }
}
</script>

<style lang="scss">
@import '@/stylesheets/layouts/DefaultLayout.scss';
</style>
