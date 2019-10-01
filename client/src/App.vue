<template>
  <div class="game">
    <div class="stars"></div>
    <div class="twinkling"></div>
    <div class="clouds"></div>
    <WaitingLobbyScreen />
  </div>
<!--  <div id="app">-->
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
<!--    <router-view/>-->
<!--  </div>-->
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
  import WaitingLobbyScreen from '@/components/WaitingLobbyScreen.vue'
  import { Socket } from 'vue-socket.io-extended';

@Component({
    components: {
        WaitingLobbyScreen,
    }
})

export default class Home extends Vue {
  title: string;

    constructor() {
      super();
      this.title = 'Port of Mars'
    }

    @Socket('joinGame')
    onJoinGame(data: unknown) {
        console.log(data);
    }

    mounted() {
        console.log((this as any).$socket);
        (this as any).$socket.client.emit('joinGame', { my: 'data' });
    }
}
</script>

<style>

  /* ==============================================================================================
      Background - Copyright (c) 2019 by WebSonick (https://codepen.io/WebSonick/pen/vjmgu)
  ================================================================================================= */

  * {
    margin: 0;
    padding: 0;
  }

  @keyframes move-twink-back {
    from { background-position: 0 0; }
    to { background-position: -10000px 5000px; }
  }

  @keyframes move-clouds-back {
    from { background-position: 0 0; }
    to { background-position: -10000px 5000px; }
  }

  .stars, .twinkling, .clouds {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .stars {
    background:#000000 url(http://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
    z-index: -1;
  }

  .twinkling {
    background: transparent url(http://www.script-tutorials.com/demos/360/images/twinkling.png) repeat top center;
    z-index: 0;
    animation: move-twink-back 200s linear infinite;
  }

  .clouds {
    background: transparent url(http://www.script-tutorials.com/demos/360/images/clouds3.png) repeat top center;
    z-index: 2;
    animation: move-clouds-back 200s linear infinite;

  }

  /* ==============================================================================================
    End Background - Copyright (c) 2019 by WebSonick (https://codepen.io/WebSonick/pen/vjmgu)
================================================================================================= */

  /*html {*/
  /*  font-size: 16px;*/
  /*}*/

  html, body, .game {
    height: 100%;
  }

  body {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }

  .game {
    display: flex;
    flex-flow: row nowrap;
  }
</style>
