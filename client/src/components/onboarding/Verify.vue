<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-center">
        <h1>Verify Your Email</h1>
        <p>placeholder</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-right">
        <b-button variant="primary" size="lg" @click="$emit('completed')">Verify</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
// TODO: implement email verification

import { Component, Prop, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";

@Component({})
export default class Verify extends Vue {
  @Prop({default: "dummytoken"}) token!: string;

  private verifyEmail: boolean = true;

  get verifyUrl() {
    return url(`/registration/verify/${this.token}`);
  }

  async submit() {
    
  }
}
</script>

<style lang="scss" scroped>

</style>
