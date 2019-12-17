<template>
  <div class="default-layout">
    <!-- <div class="stars" v-if="$route.path !== '/game' && $route.path !== '/lobby'"></div>
    <div class="twinkling" v-if="$route.path !== '/game' && $route.path !== '/lobby'"></div>
    <div class="clouds" v-if="$route.path !== '/game' && $route.path !== '/lobby'"></div> -->
    <router-view />
    {{routerInfo}}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { WaitingRequestAPI } from '../api/waitingLobbyAPI/request';

@Component({
  name: 'default-layout'
})
export default class DefaultLayout extends Vue {
  @Inject()
  readonly $api!: WaitingRequestAPI;

  get routerInfo(){
      if(this.$api.joinGame !== undefined && this.$route.path == '/game'){
         this.$api.joinGame();
      }
    return this.$route.path;
  }
}
</script>

<style>
.default-layout {
  background-color: var(--space-gray);
}

/* Background - Copyright (c) 2019 by WebSonick (https://codepen.io/WebSonick/pen/vjmgu) */
@keyframes move-twink-back {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -10000px 5000px;
  }
}

@keyframes move-clouds-back {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -10000px 5000px;
  }
}

.stars,
.twinkling,
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.stars {
  z-index: 0;
  background: #000 url('../assets/marsstars.png') repeat top center;
}

.twinkling {
  z-index: 0;
  background: transparent url('../assets/marstwinkling.png') repeat top center;
  animation: move-twink-back 500s linear infinite;
}

.clouds {
  z-index: 0;
  background: transparent url('../assets/marsclouds.png') repeat top center;
  animation: move-clouds-back 500s linear infinite;
}

/* ==============================================================================================
    End Background - Copyright (c) 2019 by WebSonick (https://codepen.io/WebSonick/pen/vjmgu)
================================================================================================= */
</style>
