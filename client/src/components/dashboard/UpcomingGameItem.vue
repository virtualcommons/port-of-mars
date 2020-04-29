<template>
  <div class="c-upcoming-game-item container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <p>Time: {{ toTimeString(upcomingGame.time) }}</p>
      </div>
    </div>
    <div class="buttons-wrapper row">
      <div class="buttons col-12">
        <router-link :to="joinLink">
          <BButton class="button">Join</BButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { GameMeta } from '@port-of-mars/shared/types';
import { LOBBY_PAGE } from '@port-of-mars/shared/routes';
import { BButton } from 'bootstrap-vue';

@Component({
  components: {
    BButton,
  },
})
export default class UpcomingGameItem extends Vue {
  @Prop() private upcomingGame!: GameMeta;

  get joinLink() {
    return { name: LOBBY_PAGE };
  }

  private toTimeString(unixtimestamp: number): string {
    return new Date(unixtimestamp).toLocaleTimeString();
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/dashboard/UpcomingGameItem.scss';
</style>
