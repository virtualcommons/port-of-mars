<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto">
    <b-row class="m-0 p-3">
      <b-col cols="12" class="d-flex align-items-center">
        <label class="mb-0 mr-2"><h4>Mode</h4></label>
        <b-form-select v-model="selectedMode" :options="modeOptions" size="lg" class="w-auto" />
      </b-col>
    </b-row>
    <b-row class="h-75 m-0">
      <b-col cols="12">
        <StudiesList :mode="selectedMode" :key="selectedMode" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { StudyMode } from "@port-of-mars/shared/types";
import StudiesList from "@port-of-mars/client/components/admin/StudiesList.vue";

@Component({
  components: {
    StudiesList,
  },
})
export default class Studies extends Vue {
  selectedMode: StudyMode = "solo";
  modeOptions = [
    { value: "solo", text: "Solo" },
    { value: "multiplayer", text: "Multiplayer" },
    { value: "interactive", text: "Interactive" },
  ];
}
</script>
