<template>
  <div class="login">
    <div class="wrapper">
      <div class="text">
        <h1>Port of Mars</h1>
        <h2>Register</h2>
      </div>
      <form class="login-form">
        <div class="input-username">
          <label for="name">Name</label>
          <div class="input-wrapper">
            <input type="text" id="name" name="name" v-model="name" />
          </div>
        </div>
        <div class="input-username">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <input type="email" id="email" name="email" v-model="email" />
          </div>
        </div>
        <div class="submit">
          <input
            :disabled="submitDisabled"
            type="submit"
            @click="register"
            value="Register"
          />
        </div>
        <p class="error" v-if="error">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { GAME_PAGE } from '@port-of-mars/shared/routes';

@Component({})
export default class Register extends Vue {
  username: string = '';
  name: string = '';
  email: string = '';

  error: string = '';

  async register(e: Event) {
    e.preventDefault();
    const fd = new FormData((e as any).target.form);
    const data: any = { name: fd.get('name'), email: fd.get('email') };
    const response = await this.$ajax.post(this.registerUrl, data);
    if (response.status === 200) {
      this.$router.push(GAME_PAGE);
    } else {
      this.error = await response.json();
    }
  }

  get submitDisabled() {
    return this.name.length === 0 || this.email.length === 0;
  }

  get registerUrl() {
    return `${process.env.SERVER_URL_HTTP}/registration/register`;
  }
}
</script>

<style lang="scss" scoped>
// @import '@port-of-mars/client/stylesheets/views/Login.scss';
</style>
