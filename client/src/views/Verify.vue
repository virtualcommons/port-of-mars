<template>
  <div class="login">
    <div class="wrapper">
      <div class="text">
        <h1>Verify your email address</h1>
      </div>
      <div>
        <div>
          <b-button squared size="lg" variant="dark" class="button" @click="submit">
            Verify Email
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from "vue-property-decorator";
  import {
    DASHBOARD_PAGE,
    GAME_PAGE,
    LOBBY_PAGE,
    LOGIN_PAGE
  } from "@port-of-mars/shared/routes";
  import {url} from "@port-of-mars/client/util";
  import {BButton} from "bootstrap-vue";


  @Component({})
  export default class Verify extends Vue {
    @Prop()
    registrationToken!: string;

    async submit() {
      await this.$ajax.post(this.verifyUrl, ({data, status}) => {
        // FIXME: these types of store commits should be abstracted away by a coherent store API that all Vue components talk to
        this.$tstore.commit('SET_DASHBOARD_MESSAGE', { kind: 'success', message: 'Email successfully verified.' });
        this.$router.push({ name: DASHBOARD_PAGE });
      });
    }

    get verifyUrl() {
      return url(`/registration/verify/${this.registrationToken}`);
    }
  }
</script>

<style lang="scss" scoped>
  @import "@port-of-mars/client/stylesheets/views/Login.scss";
</style>
