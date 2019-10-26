<template>
    <div class="login-button-container">
      <router-link to="/game">
        <BButton>Go to dashboard</BButton>
      </router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BButton } from 'bootstrap-vue';

  @Component({
    components: {
      BButton,
    },
  })

export default class LoginButton extends Vue {}
</script>

<style scoped>

</style>
