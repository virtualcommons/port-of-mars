<template>
  <b-container fluid class="h-100 m-0 p-0 bg-content">
    <div id="privacy-policy" class="p-5">
      <h1>Privacy Policy</h1>
      <hr />
      <!-- FIXME: update links for eduator version -->
      <p>
        This Privacy Policy explains how we collect, use, and share personal information when you
        visit our website,
        <a href="https://portofmars.asu.edu/">portofmars.asu.edu/ educator ??</a>.
      </p>
      <p>
        By using our website, you agree to the collection, use, and sharing of your personal
        information as described in this Privacy Policy. If you do not agree with our policies and
        practices, do not use our website.
      </p>

      <h4>Information We Collect</h4>
      <p></p>

      <h4>How We Use Your Information</h4>
      <p></p>

      <h4>Sharing Your Information</h4>
      <p></p>

      <h4>Your Rights</h4>
      <p></p>

      <h4>Data Retention</h4>
      <p></p>
      <h4>Changes to our Privacy Policy</h4>
      <p></p>
      <h4>Contact Us</h4>
      <p>
        If you have any questions or concerns about our Privacy Policy or the collection, use, or
        sharing of your personal information, please contact us at
        <a :href="`mailto:${$settings.CONTACT_EMAIL}`">{{ $settings.CONTACT_EMAIL }}</a
        >.
      </p>
    </div>
    <Footer></Footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue, Provide } from "vue-property-decorator";
import { Client } from "colyseus.js";

export default class educatorPrivacy extends Vue {}
</script>

<style lang="scss" scoped>
#privacy-policy {
  max-width: 1200px;
  margin: auto;
}

h4,
ul,
p {
  color: #fff;
}

ul {
  padding-left: 2rem;
}
</style>
