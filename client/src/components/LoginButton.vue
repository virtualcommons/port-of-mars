<template>
    <div class="login-button-container">
      <b-button variant="dark">Dark</b-button>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BButton } from 'bootstrap-vue';

  @Component({
    components: {
      'b-button': BButton,
    },
  })

export default class LoginButton extends Vue {}
</script>

<style scoped>

</style>
