<template>
  <div class="c-action-item container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <p>{{ actionItem.description }}</p>
      </div>
    </div>
    <div class="buttons-wrapper row">
      <div class="buttons col-12">
        <b-button
          v-if="isInternal(actionItem.link)"
          :to="actionItem.link.data"
          class="button">Go <b-icon icon="arrow-right"></b-icon></b-button>
        <b-button v-else :href="toUrl(actionItem.link.data)" class="button">Go <b-icon icon="box-arrow-up-right"></b-icon></b-button>
        <b-icon v-if="actionItem.done" icon="check-box" font-scale="3" variant="success"></b-icon>
        <b-icon v-else icon="x-circle-fill" font-scale="3" variant="warning"></b-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ActionItem } from '@port-of-mars/shared/types';
import { url } from '@port-of-mars/client/util';

@Component({})
export default class ActionItemComponent extends Vue {
  @Prop() private actionItem!: ActionItem;

  private isInternal(link: ActionItem['link']) {
    return link.kind === 'internal';
  }

  toUrl(href: string): string {
    // for local testing: converts "external" href links to the appropriate localhost:2567 to hit the actual server
    // if it's a true external link (e.g., to qualtrics) leave it alone
    if (href.startsWith('http')) {
      return href;
    }
    else {
      return url(href);
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/dashboard/ActionItem.scss';
</style>
