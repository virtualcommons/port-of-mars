<template>
  <div class="container-members v-step-17">
    <Member
      class="v-step-18"
      v-for="member in members"
      :key="member"
      :playerRole="member"
      :playerScore="10"
      :memberNotificationTradeCount="1"
      :memberNotificationFinished="true"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Member from '@/components/gamedashboard/Member.vue';

@Component({
  components: {
    Member
  }
})
export default class ContainerMembers extends Vue {
  get members() {
    if (this.$store.state.role !== '') {
      return ['Researcher', 'Pioneer', 'Curator', 'Entrepreneur', 'Politician'].filter(
        name => name !== this.$store.state.role
      );
    }
    return ['Researcher', 'Pioneer', 'Curator', 'Entrepreneur', 'Politician'].filter(
      name => name !== 'Curator'
    );
  }
}
</script>

<style scoped>
.container-members {
  max-height: 50%;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}
</style>
