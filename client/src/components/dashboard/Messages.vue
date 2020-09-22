<template>
  <b-container>
    <b-row v-if="messages.length > 0" class='justify-content-md-center'>
      <!-- MESSAGES -->
      <b-alert v-for="dm in messages" :key="dm.message" :variant="dm.kind" dismissible fade show>
        {{ dm.message }}
      </b-alert>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({})
  export default class Messages extends Vue {
    get messages() {
      return this.$tstore.state.dashboardMessages;
    }
  }
</script>

<style lang="scss" scoped>
</style>
