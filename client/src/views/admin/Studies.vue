<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto">
    <b-row class="h-100 m-0">
      <b-col cols="6">
        <StudiesList mode="solo" />
      </b-col>
      <b-col cols="6">
        <StudiesList mode="multiplayer" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudiesList from "@port-of-mars/client/components/admin/StudiesList.vue";

@Component({
  components: {
    StudiesList,
  },
})
export default class Studies extends Vue {}
</script>
