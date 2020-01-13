<template>
  <div class="default-layout">
    <!-- <div class="stars" v-if="$route.path !== '/game' && $route.path !== '/lobby'"></div>
    <div class="twinkling" v-if="$route.path !== '/game' && $route.path !== '/lobby'"></div>
    <div class="clouds" v-if="$route.path !== '/game' && $route.path !== '/lobby'"></div> -->
    <LoadingScreen v-if="loading" />
    <router-view v-else />
    {{ routerInfo }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { WaitingRequestAPI } from '../api/waitingLobby/request';
import LoadingScreen from '@/components/global/LoadingScreen.vue';

@Component({
  name: 'default-layout',
  components: {
    LoadingScreen
  }
})
export default class DefaultLayout extends Vue {
  @Inject() readonly $api!: WaitingRequestAPI;

  mounted() {
    // this.routerInfo();
  }

  get loading(): boolean {
    return this.$store.state.loading;
  }

  get routerInfo() {
    // TODO: NEED TO FIX LOADINGSCREEN AFTER API REFACTOR
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
