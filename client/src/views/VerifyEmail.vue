<template>
  <b-modal body-bg-variant="dark" centered header-bg-variant="dark" header-border-variant="dark"
           hide-footer hide-header
           hide-header-close no-close-on-backdrop no-close-on-esc
           v-model="verifyEmail">
    <h3 class="text-center p-2"><strong>VERIFY YOUR EMAIL</strong></h3>
    <b-button @click="submit" block class="mt-4" size="lg" squared variant="warning">Verify
    </b-button>
  </b-modal>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {DASHBOARD_PAGE} from "@port-of-mars/shared/routes";
  import {url} from "@port-of-mars/client/util";

  @Component({})
  export default class Verify extends Vue {
    @Prop() token!: string;
    private verifyEmail: boolean = true;

    get verifyUrl() {
      return url(`/registration/verify/${this.token}`);
    }

    async submit() {
      console.log(`POSTING TO ${this.verifyUrl}`)
      await this.$ajax.post(this.verifyUrl, ({data, status}) => {
        // FIXME: these types of store commits should be abstracted away by a coherent store API that all Vue components talk to
        this.$tstore.commit("SET_DASHBOARD_MESSAGE", {
          kind: "success",
          message: "Email successfully verified."
        });
        this.$router.push({name: DASHBOARD_PAGE});
      });
    }
  }
</script>

<style lang="scss" scoped>
  @import "@port-of-mars/client/stylesheets/views/Login.scss";
</style>
