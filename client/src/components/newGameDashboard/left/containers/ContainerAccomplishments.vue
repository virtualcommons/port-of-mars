<template>
  <div class="container-accomplishments tour-accomplishments">
    <div class="topbar">
      <p class="title">Your Accomplishments</p>
      <div class="buttons">
        <button
          @click="handleClick('available')"
          :style="handleStyle('available')"
          class="available"
          type="button"
          name="Available Button Option"
        >
          Available
        </button>
        <button

          @click="handleClick('purchased')"
          :style="handleStyle('purchased')"
          class="purchased"
          type="button"
          name="Purchased Button Option"
        >
          Purchased
        </button>
      </div>
    </div>
    <div class="accomplishment-cards">
      <div class="available" v-if="activeView == 'available'">
        <p
          v-if="purchasableAccomplishments.length === 0"
          class="available-empty"
        >
          No Available Accomplishments
        </p>
        <CardAccomplishment
          v-for="accomplishment in purchasableAccomplishments"
          :key="accomplishment.id"
          :accomplishment="accomplishment"
        />
      </div>

      <div class="purchased" v-if="activeView == 'purchased'">
        <p v-if="purchasedAccomplishments.length === 0" class="purchased-empty">
          No Purchased Accomplishments
        </p>
        <CardAccomplishment
          v-for="accomplishment in purchasedAccomplishments"
          :key="accomplishment.id"
          :accomplishment="accomplishment"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import CardAccomplishment from '@port-of-mars/client/components/gamedashboard/global/cards/CardAccomplishment.vue';
import { Phase } from '@port-of-mars/shared/types';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';


@Component({
  components: {
    CardAccomplishment
  }
})
export default class ContainerAccomplishments extends Vue {
  @Inject()
  readonly api!: TutorialAPI;

  private activeView: string = 'available';
  private isActive: boolean = true;
  private setWidth: string = '100%';



  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishments.purchasable;
  }

  get purchasedAccomplishments() {
    return this.$store.getters.player.accomplishments.purchased;
  }

  get isInTutorial(){
    return this.$store.getters.layout == 'tutorial';
  }

  private handleClick(view: string) {
    this.activeView = view;

    if(this.isInTutorial){
      this.api.completedGeneralClick();
    }
  }

  private handleStyle(view: string) {
    return this.activeView == view ? { color: 'var(--new-space-orange)' } : '';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/left/containers/ContainerAccomplishments.scss';
</style>
