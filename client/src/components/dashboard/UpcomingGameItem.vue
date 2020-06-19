<template>
  <div class="d-flex justify-content-between container wrapper">
    <div>
      <p class="next-game">Next Game at {{ toTimeString(upcomingGame.time) }}</p>
    </div>
        <router-link :to="joinLink">
          <b-button class="button px-4 py-1" variant="outline-light">Join</b-button>
        </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { GameMeta } from '@port-of-mars/shared/types';
import { LOBBY_PAGE } from '@port-of-mars/shared/routes';

@Component({})
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
