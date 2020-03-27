<template>
  <div class="container-accomplishment">
        <div class="accomplishment-cards">
            <p
            v-if="isVisible && accomplishmentSet.length === 0"
            class="empty"
            >
                No Available Accomplishments
            </p>
            <p v-if="!isVisible"
            class="not-audit-text">
                Information only visible during audit event
            </p>
            <div v-if="isVisible">
                <CardAccomplishment class="cards"           
                v-for="accomplishment in accomplishmentSet"
                :key="accomplishment.id"
                :accomplishment="accomplishment"
                />
            </div>
        </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Prop } from 'vue-property-decorator';
import CardAccomplishment from '@port-of-mars/client/components/newGameDashboard/global/cards/CardAccomplishment.vue';
import { Phase } from '@port-of-mars/shared/types';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';


@Component({
  components: {
    CardAccomplishment
  }
})
export default class ContainerAccomplishmentsGeneral extends Vue {

  @Prop() accomplishmentSet!:any;
  @Prop({default:false}) isVisible!:boolean;

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/left/containers/ContainerAccomplishmentsGeneral.scss';
</style>
