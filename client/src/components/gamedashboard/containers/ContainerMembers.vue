<template>
  <div class="container-members" id="v-step-1">
    <Member
      :playerRole="'Researcher'"
      :playerScore="14"
      :notificationCount="1"
      :style="{ 'background-color': 'var(--color-researcher)' }"
    />
    <Member
      :playerRole="'Pioneer'"
      :playerScore="11"
      :notificationCount="0"
      :style="{ 'background-color': 'var(--color-pioneer)' }"
    />
    <Member
      :playerRole="'Curator'"
      :playerScore="5"
      :notificationCount="2"
      :style="{ 'background-color': 'var(--color-curator)' }"
    />
    <Member
      :playerRole="'Entrepreneur'"
      :playerScore="3"
      :notificationCount="0"
      :style="{ 'background-color': 'var(--color-entrepreneur)' }"
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
