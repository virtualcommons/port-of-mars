<template>
  <b-container fluid class="h-100 m-0 p-0 bg-content">
    <div id="privacy-policy" class="p-5">
      <h1>Privacy Policy</h1>
      <h3>For K-12 classroom use</h3>
      <hr />
      <p>
        This Privacy Policy explains how we collect, use, and share personal information for the
        K-12 version of our website and online game,
        <a href="https://learn.portofmars.asu.edu/">learn.portofmars.asu.edu</a>. This version is
        designed for classroom use by teachers and their students.
      </p>
      <p>
        By using our website, you agree to the collection, use, and sharing of your personal
        information as described below. If you do not agree with these terms, do not use this
        version.
      </p>

      <h4>Information We Collect</h4>
      <p>We only collect the following:</p>
      <ul>
        <li>
          <strong>Teachers:</strong> Email addresses and optional full names provided voluntarily.
        </li>
        <li>
          <strong>Students:</strong> We do not collect student emails. Instead, students are asked
          to provide an ID or nickname assigned by their teacher. This identifier is used solely for
          classroom purposes, and no additional personally identifying information is collected. All
          other game data remains non-identifying.
        </li>
      </ul>

      <h4>How We Use Your Information</h4>
      <ul>
        <li>To run and maintain our website and online game.</li>
        <li>
          To communicate important information to teachers regarding game updates and classroom
          usage.
        </li>
      </ul>

      <h4>Sharing Your Information</h4>
      <p>
        We do not sell or trade your personal information. Teachers' email addresses may be used
        solely for administrative purposes. Any game data from students is stored anonymously and
        will never be used in research studies or sold.
      </p>

      <h4>Children's Privacy</h4>
      <p>
        In compliance with the Children's Online Privacy Protection Act (COPPA), we do not knowingly
        collect personal information from children under the age of 13. The K-12 version is designed
        for use in a classroom setting under teacher supervision. No personally identifiable
        information is collected from students.
      </p>

      <h4>Your Rights</h4>
      <p>
        Teachers have rights under applicable laws (such as the GDPR, CCPA, and CalOPPA) to access,
        correct, or delete their personal information. To exercise these rights, please contact us
        using the information below. We may need to verify your identity before processing your
        request.
      </p>

      <h4>Data Retention</h4>
      <p>
        We retain your personal information only as long as necessary to provide our services and
        meet legal obligations.
      </p>

      <h4>Changes to Our Privacy Policy</h4>
      <p>
        We may update this Privacy Policy occasionally. We will post any changes on this page.
        Regular review of our policy is advised.
      </p>

      <h4>Contact Us</h4>
      <p>
        Questions or concerns? Contact us at
        <a :href="`mailto:${$settings.CONTACT_EMAIL}`">{{ $settings.CONTACT_EMAIL }}</a
        >.
      </p>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class EducatorPrivacy extends Vue {}
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
  list-style: circle !important;
  padding-left: 2rem;
}
</style>
