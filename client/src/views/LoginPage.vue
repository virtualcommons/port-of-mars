<template>
  <div class="loginpage">
    <div class="stars"></div>
    <div class="twinkling"></div>
    <div class="clouds"></div>
    <div class="login-screen">
      <h1>Port of Mars</h1>
      <LoginButton />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import LoginButton from '@/components/loginpage/LoginButton.vue';

@Component({
  components: {
    LoginButton,
  },
})
export default class LoginPage extends Vue {}
</script>

<style>
.loginpage {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  background-color: pink;
}
.login-screen {
  position: relative;
  z-index: 1;
  height: 80vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.login-screen h1 {
  text-transform: uppercase;
  letter-spacing: 0.25rem;
  font-size: 12rem;
  font-weight: 700;
  color: var(--space-orange);
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
