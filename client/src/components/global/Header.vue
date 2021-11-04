<template>
  <b-navbar toggleable="lg" type="dark" variant="primary">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
    <b-navbar-brand :to="dashboard">
        <b-img
        v-bind="portOfMarsLogoProps"
        :src="require(`@port-of-mars/client/assets/background/logo.png`)"
        alt="Port of Mars"
        >
        </b-img>
    </b-navbar-brand>
    <h2 class="mx-auto">{{ title }}</h2>
    <b-navbar-nav class="ml-auto">
      <slot name="nav-items"><b-nav-item :to="consent">Consent Form</b-nav-item></slot>
      <b-nav-item :href="contactUrl">Contact Us</b-nav-item>
      <b-nav-item @click="logout">Logout</b-nav-item>
    </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
import { LOGIN_PAGE, REGISTER_PAGE } from "@port-of-mars/shared/routes";

@Component({})
export default class Header extends Vue {

  @Prop({ default: "Mission Control Dashboard"})
  title;

  contactUrl = "mailto:portmars@asu.edu";

  portOfMarsLogoProps = {
    height: 50,
  };

  get consent() {
    return { name: REGISTER_PAGE };
  }

  logout() {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: LOGIN_PAGE });
  }

}
</script>