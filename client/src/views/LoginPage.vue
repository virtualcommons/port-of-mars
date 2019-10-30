<template>
    <div>
        <div class="stars"></div>
        <div class="twinkling"></div>
        <div class="clouds"></div>
        <LoginScreen />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import LoginScreen from '@/components/LoginScreen.vue';

    @Component({
      components: {
        LoginScreen,
      },
    })

export default class LoginPage extends Vue {}
</script>

<style>
  /* Background - Copyright (c) 2019 by WebSonick (https://codepen.io/WebSonick/pen/vjmgu) */
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
    left: 0;
    right: 0;
    bottom: 0;
  }

  .stars {
    background:#000 url(http://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
    z-index: 0;
  }

  .twinkling {
    background: transparent url(http://www.script-tutorials.com/demos/360/images/twinkling.png) repeat top center;
    z-index: 0;
    animation: move-twink-back 500s linear infinite;
  }

  .clouds {
    background: transparent url(http://www.script-tutorials.com/demos/360/images/clouds3.png) repeat top center;
    z-index: 0;
    animation: move-clouds-back 500s linear infinite;

  }

  /* ==============================================================================================
    End Background - Copyright (c) 2019 by WebSonick (https://codepen.io/WebSonick/pen/vjmgu)
================================================================================================= */

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
