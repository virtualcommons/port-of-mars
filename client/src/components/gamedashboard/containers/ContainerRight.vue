<template>
  <div class="container-right">
    <p class="scores-title">Player Scores</p>
    <ContainerMembers />
    <Chat />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Chat from '@/components/gamedashboard/Chat.vue';
import ContainerMembers from '@/components/gamedashboard/containers/ContainerMembers.vue';

@Component({
  components: {
    Chat,
    ContainerMembers
  }
})
export default class ContainerRight extends Vue {}
</script>

<style scoped>
.container-right {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.scores-title {
  margin: 0 0 0.5rem 0;
  border-bottom: 0.125rem solid var(--space-orange);
  display: inline-block;
  align-self: flex-end;
  font-size: var(--font-large);
  text-align: right;
  color: var(--space-white);
}

@media (max-width: 1680px) {
  .scores-title {
    margin-bottom: 2rem;
  }
}
</style>
