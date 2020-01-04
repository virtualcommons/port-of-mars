<template>
  <div class="loginpage">
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
    LoginButton
  }
})
export default class LoginPage extends Vue {}
</script>

<style lang="scss">
@import '@/stylesheets/views/LoginPage.scss';
</style>
