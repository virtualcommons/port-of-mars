<template>
  <div class="c-action-item container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <p>{{ actionItem.description }}</p>
      </div>
    </div>
    <div class="buttons-wrapper row">
      <div class="buttons col-12">
        <BButton
          v-if="isInternal(actionItem.link)"
          :to="actionItem.link.data"
          class="button"
          >Go</BButton
        >
        <BButton v-else :href="actionItem.link.data" class="button">Go</BButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ActionItem } from '@port-of-mars/shared/types';
import { BButton } from 'bootstrap-vue';

@Component({
  components: {
    BButton,
  },
})
export default class ActionItemComponent extends Vue {
  @Prop() private actionItem!: ActionItem;

  private isInternal(link: ActionItem['link']) {
    return link.kind === 'internal';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/dashboard/ActionItem.scss';
</style>
