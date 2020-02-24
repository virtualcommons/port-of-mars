<template>
    <div class='go-to-lobby-modal'>
      <div class="content">
        <div class="text-content">
            <p class="thank-you-text"><b>Thank you for completing the Tutorial!</b></p>
            <p class="upcoming-text">You are now eligible to play in upcoming games!</p>
        </div>
        <div class="image">
            <div class="profile">
                <div class="p-container">
                <div class="frame-outer">
                    <div  class="frame-inner">
                        <img src="@/assets/characters-large/Researcher.png" alt="Player" />
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      <button class="lobby-button" @click="goToLobby">Go to waiting lobby</button>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'tutorialComplete',
  components: {}
})
export default class CompletedQuizModal extends Vue{
    async goToLobby(){
        await this.$router.push({ name: 'WaitingLobby' });
        return;
    }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/tutorial/CompletedQuizModal.scss';
</style>