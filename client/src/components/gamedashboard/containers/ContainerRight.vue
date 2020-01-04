<template>
  <div class="container-right">
    <ContainerPlayers />
    <Chat />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerPlayers from '@/components/gamedashboard/containers/ContainerPlayers.vue';
import Chat from '@/components/gamedashboard/Chat.vue';

@Component({
  components: {
    ContainerPlayers,
    Chat
  }
})
export default class ContainerRight extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/containers/ContainerRight.scss';
</style>
