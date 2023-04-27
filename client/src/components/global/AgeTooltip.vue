<template>
  <span>
    <a><b-icon-question-circle id="age-info-popover" scale=".8" /></a>
    <b-popover target="age-info-popover" :placement="placement" triggers="hover focus">
      <template #title></template>
      This is a requirement to be able to participate in the Port of Mars research study. Read more
      on our
      <b-link :to="consent">consent form</b-link>
    </b-popover>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { CONSENT_PAGE } from "@port-of-mars/shared/routes";

@Component({})
export default class Home extends Vue {
  @Prop({ default: "top" })
  placement!: string;

  consent = { name: CONSENT_PAGE };
}
</script>

<style lang="scss" scoped></style>
