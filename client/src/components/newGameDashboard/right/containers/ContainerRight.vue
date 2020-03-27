<template>
  <div class="container-right">
    <ContainerPlayers />
    <Chat />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerPlayers from '@port-of-mars/client/components/newGameDashboard/right/containers/ContainerPlayers.vue';
import Chat from '@port-of-mars/client/components/newGameDashboard/right/Chat.vue';

@Component({
  components: {
    ContainerPlayers,
    Chat
  }
})
export default class ContainerRight extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/right/containers/ContainerRight.scss';
</style>
