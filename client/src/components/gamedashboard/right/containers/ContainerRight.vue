<template>
  <div class="container-right">
    <ContainerPlayers />
    <Chat />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerPlayers from '@/components/gamedashboard/right/containers/ContainerPlayers.vue';
import Chat from '@/components/gamedashboard/right/Chat.vue';

@Component({
  components: {
    ContainerPlayers,
    Chat
  }
})
export default class ContainerRight extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/right/containers/ContainerRight.scss';
</style>
