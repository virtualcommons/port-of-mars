<template>
  <div class="container-right">
    <div class="placeholder-right">
      <!-- will eventually refactor -->
      <Member />
      <Member />
      <Member />
      <Member />
      <Member />
    </div>
    <Chat />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Member from '@/components/Member.vue';
import Chat from '@/components/Chat.vue';

@Component({
  components: {
    Member,
    Chat,
  },
})

export default class ContainerRight extends Vue {}
</script>

<style scoped>
.placeholder-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 50%;
  padding: 1rem 0;
  /* background-color: purple; */
}

.container-right {
  height: 100%;
  width: 100%;
  padding: 1rem 1rem 1rem 0rem;
}
</style>
