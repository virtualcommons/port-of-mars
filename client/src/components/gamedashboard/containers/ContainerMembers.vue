<template>
  <div class="container-members" id="v-step-1">
    <Member
      :playerRole="'Researcher'"
      :playerScore="14"
      :notificationCount="1"
      :style="{ 'background-color': 'rgba(67, 124, 174, 0.2)' }"
    />
    <Member
      :playerRole="'Pioneer'"
      :playerScore="11"
      :notificationCount="0"
      :style="{ 'background-color': 'rgba(111, 36, 134, 0.2)' }"
    />
    <Member
      :playerRole="'Curator'"
      :playerScore="5"
      :notificationCount="2"
      :style="{ 'background-color': 'rgba(103, 65, 29, 0.2)' }"
    />
    <Member
      :playerRole="'Entrepreneur'"
      :playerScore="3"
      :notificationCount="0"
      :style="{ 'background-color': 'rgba(199, 168, 40, 0.2)' }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Member from '@/components/gamedashboard/Member.vue';

@Component({
  components: {
    Member,
  },
})
export default class ContainerMembers extends Vue {}
</script>

<style scoped>
.container-members {
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}
</style>
