<template>
  <b-container fluid class="h-100 m-0 p-0">
    <div id="privacy-wrapper">
      <div id="privacy-policy" class="p-5">
        <h1>Privacy Policy</h1>
        <hr>
        <p>
          This Privacy Policy explains how we collect, use, and share personal information when 
          you visit our website, <a href="https://portofmars.asu.edu/">portofmars.asu.edu</a>.
        </p>
        <p>
          By using our website, you agree to the collection, use, and sharing of your personal
          information as described in this Privacy Policy. If you do not agree with our policies
          and practices, do not use our website.
        </p>
        <h4>Information We Collect</h4>
        <p>
          We collect minimal information from and about users of our website, including:
          <ul>
            <li>
              Personal information, such as your email address and optional full name, that you
              voluntarily provide to us when you create an account.
            </li>
            <li>
              Information about your device, such as your IP address and browser type, that is
              automatically collected when you visit our website.
            </li>
          </ul>
        </p>
        <h4>How We Use Your Information</h4>
        <p>
          We use the information we collect from and about you for the following purposes:
        </p>
        <ul>
          <li>
            To provide and maintain our website and online game.
          </li>
          <li>
            To improve our website and to ensure that content is presented in the most effective
            manner for you and for your device.
          </li>
          <li>
            To communicate with you about winnings and other important information.
          </li>
        </ul>
        <h4>Sharing Your Information</h4>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to outside parties
          without your consent, except as required by law.
        </p>
        <p>
          Anonymized participant data may be published as results of a research study, but your
          personal information such as email address and name will be removed from the data before
          publication. You can read more about the study in our
          <a href="https://researchintegrity.asu.edu/human-subjects"> Arizona State University IRB</a>-approved
          <a href="https://portofmars.asu.edu/#/register">consent form</a>.
        </p>
        <p>
          We may share your personal information with third parties who provide services on our
          behalf, such as hosting our website or sending email communications. These third parties
          are obligated to protect your personal information and may not use it for any other
          purpose.
        </p>
        <h4>Your Rights</h4>
        <p>
          Under the GDPR, CCPA, and CalOPPA, you have certain rights with respect to your personal
          information, including the right to access, correct, delete, and object to the processing
          of your personal information. You may also have the right to data portability and the
          right to withdraw your consent to the collection and processing of your personal
          information.
        </p>
        <p>
          To exercise your rights, please contact us using the contact information provided below.
          We will respond to your request as soon as possible and in any case within the time periods
          prescribed by law.
          Please note that we may need to verify your identity before fulfilling your request.
        </p>
        <h4>Data Retention</h4>
        <p>
          We retain your personal information for as long as necessary to provide you with our
          services and to comply with our legal obligations.         
        </p>
        <h4>Changes to our Privacy Policy</h4>
        <p>
          We may update our Privacy Policy from time to time. We will post any changes on this
          page and encourage you to review our Privacy Policy regularly.
        </p>
        <h4>Contact Us</h4>
        <p>
          If you have any questions or concerns about our Privacy Policy or the collection, use,
          or sharing of your personal information, please contact us at
          <a :href="`mailto:${constants.CONTACT_EMAIL}`">{{ constants.CONTACT_EMAIL }}</a>.
        </p>
      </div>
    </div>
    <Footer></Footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Constants } from "@port-of-mars/shared/settings";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

@Component({
  components: {
    Footer
  }
})
export default class Privacy extends Vue {
  get constants() {
    return Constants;
  }
}
</script>

<style lang="scss" scoped>
#privacy-wrapper {
  background-color: rgba(45, 37, 36, 1);
}

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
  list-style: circle !important;
  padding-left: 2rem;
}
</style>
