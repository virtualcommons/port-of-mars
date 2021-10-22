<template>
  <b-container fluid class="h-100 w-100 m-0 p-0">
    <b-row
      class="w-100 h-100 m-auto scroll-to-recent"
      style="overflow-y: auto; overflow-x: hidden;"
    >
      <b-row class="w-100 my-2 " align-content="end">
        <!-- if there is no history to display -->
        <p v-if="logs.length === 0" class="m-5" style="color: rgba(241, 224, 197, 0.25)">
          No Logs
        </p>
        <!-- log message -->
        <b-row
          v-for="log in logs"
          :style="{ backgroundColor: categoryColorMap.get(log.category) }"
          :key="log.id"
          class="h-auto w-100 flex-column overflow-hidden m-2 p-2"
          style="background-color: var(--marslog-orange)"
        >
          <!-- category (e.g. System Health, Event, etc.) -->
          <p class="text-capitalize m-2" style="color: var(--light-accent); font-weight: bold">
            {{ log.category }}
          </p>
          <!-- message -->
          <p class="mx-2">{{ log.content }}</p>

          <!-- timestamp and round -->
          <b-row class="w-100">
            <b-col cols="auto" class="mr-auto ml-2">
              <p>[ {{ logTime(log.timestamp) }} ]</p>
            </b-col>
            <b-col cols="auto">
              <p>ROUND {{ log.round }}</p>
            </b-col>
          </b-row>
        </b-row>
      </b-row>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {}
})
export default class MarsLog extends Vue {
  updated() {
    const elem = this.$el.querySelector(".scroll-to-recent");
    elem!.scrollTop = elem!.scrollHeight;
  }

  get logs() {
    return this.$tstore.getters.logs;
  }

  get categoryColorMap() {
    return this.$store.getters.categoryColorMap;
  }

  logTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }
}
</script>
