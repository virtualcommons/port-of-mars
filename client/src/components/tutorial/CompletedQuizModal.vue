<template>
  <div class="go-to-lobby-modal">
    <div class="content">
      <div class="text-content">
        <p class="thank-you-text">
          <b>Congratulations, you have passed Port of Mars Mission Control Training!</b>
        </p>
        <p class="upcoming-text">
          Please return to the dashboard to complete any additional onboarding tasks and check for
          available games.
        </p>
      </div>
      <div class="image">
        <div class="profile">
          <div class="p-container">
            <div class="frame-outer">
              <div class="frame-inner">
                <img
                  src="@port-of-mars/client/assets/characters-large/Researcher.png"
                  alt="Player"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-link :to="dashboard">
      <button class="lobby-button">Continue</button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";

@Component({
  name: "tutorialComplete",
  components: {}
})
export default class CompletedQuizModal extends Vue {
  get dashboard() {
    return { name: DASHBOARD_PAGE };
  }
  // async gotoDashboard() {
  //   await this.$router.push({ name: DASHBOARD_PAGE });
  //   return;
  // }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/tutorial/CompletedQuizModal.scss";
</style>
