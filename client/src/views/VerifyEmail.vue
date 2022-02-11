<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row no-gutters class="h-100 w-100 justify-content-center">
      <section id="verify-wrapper" class="d-flex flex-grow-1 w-100 m-0">
        <b-col sm="12" md="6" offset-md="3" class="text-center" align-self="center">
          <b-modal
            body-bg-variant="dark"
            centered
            header-bg-variant="dark"
            header-border-variant="dark"
            hide-footer
            hide-header
            hide-header-close
            no-close-on-backdrop
            no-close-on-esc
            v-model="verifyEmail"
            show
          >
            <h3 class="text-center p-2"><strong>VERIFY YOUR EMAIL</strong></h3>
            <b-button @click="submit" block class="mt-4" size="lg" squared variant="warning"
              >Verify
            </b-button>
          </b-modal>
        </b-col>
      </section>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DASHBOARD_PAGE, SIGNEDUP_PAGE } from "@port-of-mars/shared/routes";
import { url } from "@port-of-mars/client/util";

@Component({})
export default class Verify extends Vue {
  @Prop() token!: string;
  private verifyEmail: boolean = true;

  get verifyUrl() {
    return url(`/registration/verify/${this.token}`);
  }

  async submit() {
    console.log(`POSTING TO ${this.verifyUrl}`);
    await this.$ajax.post(this.verifyUrl, ({ data, status }) => {
      // FIXME: these types of store commits should be abstracted away by a coherent store API that all Vue components talk to
      this.$tstore.commit("SET_DASHBOARD_MESSAGE", {
        kind: "success",
        message: "Email successfully verified."
      });
      const signUpEnabled = data;
      if (signUpEnabled) {
        this.$router.push({ name: SIGNEDUP_PAGE });
      } else {
        this.$router.push({ name: DASHBOARD_PAGE });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
#verify-wrapper {
  padding: 150px 0 0 0;
}
</style>
