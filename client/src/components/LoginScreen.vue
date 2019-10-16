<template>
    <div class="login-screen">
      <PortOfMarsLogo />
      <LoginButton />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PortOfMarsLogo from '@/components/PortOfMarsLogo.vue';
import LoginButton from '@/components/LoginButton.vue';

    @Component({
      components: {
        PortOfMarsLogo,
        LoginButton,
      },
    })

export default class LoginScreen extends Vue {
  // mounted() {}
}
</script>

<style scoped>
  .login-screen {
    /*container position*/
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    /*container styling*/
    font-weight: 100;
    letter-spacing: 0.5rem;
    transition: all 0.2s;
  }
</style>
