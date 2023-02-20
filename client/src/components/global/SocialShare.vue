<template>
  <div>
    <b-button variant="twitter" class="mr-3" :href="tweetUrl" target="_blank">
      <b-icon-twitter class="float-left mr-2" />Tweet
    </b-button>
    <b-button variant="facebook" :href="fbShareUrl" target="_blank">
      <b-icon-facebook class="float-left mr-2" />Share
    </b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class SocialShare extends Vue {
  @Prop() isVictory!: boolean;
  @Prop() victoryPoints!: number;

  get shareText() {
    let text = `I just finished a game of Port of Mars with a score of ${this.victoryPoints}!`;
    text += this.isVictory
      ? " We were victorious in establishing an extraterrestrial society!"
      : " However, we ultimately succumbed to the perils of Mars.";
    return text;
  }

  get tweetUrl() {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      this.shareText
    )}&url=${encodeURIComponent(this.base_url)}`;
  }

  get fbShareUrl() {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.base_url)}`;
  }

  get base_url() {
    return window.location.origin;
  }
}
</script>
