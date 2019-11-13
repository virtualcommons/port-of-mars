<template>
  <div class="login-screen">
    <h1>Port of Mars</h1>
    <LoginButton />
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
export default class LoginScreen extends Vue {}
</script>

<style scoped>
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
</style>
