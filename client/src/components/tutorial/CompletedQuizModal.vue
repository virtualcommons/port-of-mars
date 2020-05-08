<template>
    <div class='go-to-lobby-modal'>
      <div class="content">
        <div class="text-content">
            <p class="thank-you-text"><b>Congratulations, you have passed Port of Mars Mission Control Training!</b></p>
            <p class="upcoming-text">Please return to the dashboard to complete any additional onboarding tasks and check for available games.</p>
        </div>
        <div class="image">
            <div class="profile">
                <div class="p-container">
                <div class="frame-outer">
                    <div class="frame-inner">
                        <img src="@port-of-mars/client/assets/characters-large/Researcher.png" alt="Player" />
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      <button class="lobby-button" @click="gotoDashboard">Continue</button>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DASHBOARD_PAGE } from '@port-of-mars/shared/routes';

@Component({
  name: 'tutorialComplete',
  components: {}
})
export default class CompletedQuizModal extends Vue{
    async gotoDashboard(){
        await this.$router.push({ name: DASHBOARD_PAGE });
        return;
    }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/tutorial/CompletedQuizModal.scss';
</style>
