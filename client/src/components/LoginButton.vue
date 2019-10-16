<template>
    <div class="login-button-container">
      <BButton variant="dark">Dark</BButton>
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
