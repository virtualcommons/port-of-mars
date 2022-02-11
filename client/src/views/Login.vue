<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row no-gutters class="h-100 w-100">
      <section id="login-wrapper" class="h-100 w-100 text-center">
        <div class="mx-5 p-5" id="login-container">
          <h1>Sign In to Port of Mars</h1>
          <p>
            Port of Mars is only open to Arizona State University undergraduates at the moment.
            Please sign in using your ASURITE ID below.
          </p>
          <p>
            <span v-if="signupEnabled">
              The next Mars Madness tournament is coming soon! Register and get notified when it
              starts.
            </span>
            <span v-else>
              <b-badge variant="info">Round {{ tournamentRoundNumber }}</b-badge>
              of the Mars Madness tournament is now open!
            </span>
          </p>
          <b-alert :show="tournamentRoundNumber > 1" variant="warning">
            Eligible participants have been invited via email to
            <b-badge variant="info">Round {{ tournamentRoundNumber }}</b-badge
            >.
          </b-alert>
          <b-form-checkbox v-model="toggleDevLogin" v-if="isDevMode" class="my-2">
            <p v-if="toggleDevLogin" class="text-uppercase">Test Mode Enabled</p>
            <p v-else class="text-uppercase">Enable Test Mode</p>
          </b-form-checkbox>
          <b-button v-if="isAuthenticated" size="lg" variant="warning" @click="logout">
            {{ logoutText }}
          </b-button>
          <b-button
            v-else-if="!toggleDevLogin"
            :href="asuLoginUrl"
            size="lg"
            variant="primary"
            class="w-50"
          >
            <h4 class="p-1">
              <span v-if="signupEnabled">
                Register for
              </span>
              <span v-else>
                Participate in
              </span>
              Mars Madness {{ currentYear }}
            </h4>
          </b-button>
          <!-- register form -->
          <b-form inline v-if="isDevMode && toggleDevLogin" @submit="devLogin">
            <div class="w-50 m-auto">
              <b-form-input
                id="input-username"
                v-model="devLoginUsername"
                placeholder="Enter any username for testing"
                required
                class="w-50"
              >
              </b-form-input>
              <b-button class="w-25" icon type="submit" variant="success">
                <b-icon class="mb-1" icon="box-arrow-right"></b-icon> Sign in
              </b-button>
            </div>
          </b-form>
          <b-alert v-if="error" variant="warning">{{ error }}</b-alert>
        </div>
      </section>
      <Footer></Footer>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

@Component({
  components: {
    Footer
  }
})
export default class Login extends Vue {
  devLoginUsername: string = "";
  error: string = "";
  isDevMode: boolean = false;
  toggleDevLogin: boolean = false;
  currentYear = new Date().getFullYear();
  tournamentRoundNumber = 1;

  logo = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 225,
    height: 225
  };

  get signupEnabled() {
    return this.$tstore.state.signupEnabled;
  }

  get username() {
    return this.$tstore.getters.user?.username;
  }

  get asuLoginUrl() {
    return url("/asulogin");
  }

  get logoutText() {
    return `Sign Out (${this.username})`;
  }

  get isAuthenticated() {
    return this.$tstore.getters.isAuthenticated;
  }

  async created() {
    // FIXME: this should probably come from the server when we fetchData
    this.isDevMode = isDevOrStaging();
  }

  async devLogin(e: Event) {
    e.preventDefault();
    const devLoginData: any = {
      username: this.devLoginUsername,
      password: "testing"
    };
    try {
      await this.$ajax.devLogin(devLoginData);
    } catch (e) {
      if (e instanceof Error) {
        this.error = e.message;
      }
    }
  }

  async logout() {
    await this.$ajax.forgetLoginCreds();
    this.$ajax.forgetSubmissionId();
  }
}
</script>

<style lang="scss" scoped>
p {
  color: var(--white);
}

#login-wrapper {
  padding: 250px 0 250px 0;
  background: url("../assets/images/bg-dark-moon.png");
  background-position: center;
}

#login-container {
  background-color: var(--dark-shade-75);
}

::placeholder,
#input-username {
  color: var(--dark-shade);
  background-color: var(--light-shade);
}

.title {
  letter-spacing: 0.15rem;
  font-size: 3rem;
  font-weight: 600;
  color: var(--light-shade);
}

.subtitle {
  font-size: 2rem;
  font-weight: 600;
  color: var(--light-shade);
}
</style>
