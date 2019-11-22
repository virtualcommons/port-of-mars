<template>
  <div class="container-members" id="v-step-1" >
      <Member v-for="member in members" :key="member" :playerRole="member"
        :playerScore="10" :notificationCount="1"
        :style="{ 'background-color': `var(--color-${member})` }"/>
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
export default class ContainerMembers extends Vue {
  members = ['Researcher', 'Pioneer', 'Curator', 'Entrepreneur', 'Politician'].filter(name => name !== this.$store.state.playerRole);
}
</script>

<style scoped>
.container-members {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}
</style>
