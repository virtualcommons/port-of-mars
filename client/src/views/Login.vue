<template>
  <div class="login">
    <div class="wrapper">
      <div class="text">
        <h1>Port of Mars</h1>
        <h2>Sign In</h2>
      </div>
      <form
        @submit="submitForm"
        action="https://vuejs.org/"
        method="get"
        autocomplete="off"
        class="login-form"
      >
        <div class="input-username">
          <label for="username">ASURITE ID</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="username"
              name="username"
              v-model="username"
            />
          </div>
        </div>
        <div class="input-password">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <input
              type="password"
              id="password"
              name="password"
              v-model="password"
            />
          </div>
        </div>
        <div class="submit">
          <input :disabled="submitDisabled" type="submit" value="Submit" />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Login extends Vue {
  private username: string = '';
  private password: string = '';

  get submitDisabled(): boolean {
    if (this.username && this.password) {
      return false;
    }
    return true;
  }

  private submitForm(e: any): any {
    // TODO: Authenticate user and re-route to Home screen (?)
    console.log('EVENT: ', e);
    // console.log('USERNAME: ', this.username);
    // console.log('PASSWORD: ', this.password);
    e.preventDefault();
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/views/Login.scss';
</style>
