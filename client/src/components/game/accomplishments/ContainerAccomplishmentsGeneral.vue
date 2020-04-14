<template>
  <div class="container-accomplishment container">
    <div class="accomplishment-cards">
      <p v-if="isVisible && accomplishmentSet.length === 0" class="empty">
        No Available Accomplishments
      </p>
      <p v-if="!isVisible" class="not-audit-text">
        Information only visible during audit event
      </p>
      <div v-if="isVisible">
        <AccomplishmentCard
          class="cards"
          v-for="accomplishment in accomplishmentSet"
          :key="accomplishment.id"
          :accomplishment="accomplishment"
          :showDescription="showDescription"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Prop } from 'vue-property-decorator';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import { Phase } from '@port-of-mars/shared/types';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';

@Component({
  components: {
    AccomplishmentCard,
  },
})
export default class ContainerAccomplishmentsGeneral extends Vue {
  @Prop() accomplishmentSet!: any;
  @Prop({ default: false }) isVisible!: boolean;
  @Prop({default: true})showDescription!:boolean; 
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/accomplishments/ContainerAccomplishmentsGeneral.scss';
</style>
