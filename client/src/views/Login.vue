<template>
  <div class="login">
    <div class="wrapper">
      <div class="text">
        <h1>Port of Mars</h1>
        <h2>Sign In</h2>
      </div>
      <div class="submit" v-if="isLoggedIn">

        <input type="button" @click="logout" :value="logoutText">
      </div>
      <form
        class="login-form"
        v-else
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
        <div class="submit">
          <input :disabled="submitDisabled" type="submit" @click="login" value="Login" />
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

@Component({})
export default class Login extends Vue {
  username: string = '';
  isLoggedIn: boolean = false;
  error: string = '';

  created() {
    this.isLoggedIn = !!localStorage.jwt
  }

  get submitDisabled() {
    return !this.username;
  }

  get logoutText() {
    return `Logout (${this.$tstore.state.username})`;
  }

  logout() {
    localStorage.removeItem("jwt");
    this.$tstore.commit('SET_USERNAME', { username: ''});
    this.isLoggedIn = false;
  }

  async login(e: Event) {
    e.preventDefault();
    const fd = new FormData((e as any).target.form);
    const data: any = { username: fd.get('username')};
    const response = await fetch(this.loginUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const resData = await response.json();
      localStorage.setItem('jwt', resData.token);
      this.$tstore.commit('SET_USERNAME', { username: resData.username });
      this.$router.push({ name: 'Game' });
    } else {
      this.error = await response.json();
    }
  }

  get loginUrl() {
    return `${process.env.SERVER_URL_HTTP}/login`;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/views/Login.scss';
</style>
